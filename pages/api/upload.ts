// pages/api/upload.ts
import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs/promises';
import pdfParse from 'pdf-parse';
import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';
import { storeEmbedding } from '@/lib/pinecone';
import { storeDocumentMetadata } from '@/lib/db';

// Disable Next.js body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

// Simple chunking function to split text
function chunkText(text: string, maxLength: number = 1000): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += maxLength) {
    chunks.push(text.slice(i, i + maxLength));
  }
  return chunks;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable({ multiples: false, maxFileSize: 10 * 1024 * 1024 }); // 10MB limit
  try {
    const { fields, files } = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
      (resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      }
    );

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let text = '';
    let filename = file.originalFilename || 'unnamed';
    let title = fields.title ? String(fields.title) : filename;
    if (file.mimetype === 'application/pdf') {
      const dataBuffer = await fs.readFile(file.filepath);
      const pdfData = await pdfParse(dataBuffer);
      text = pdfData.text;
    } else if (file.mimetype === 'text/plain') {
      text = await fs.readFile(file.filepath, 'utf-8');
    } else {
      return res.status(400).json({ error: 'Unsupported file type. Use PDF or text.' });
    }

    // Clean up temporary file
    await fs.unlink(file.filepath);

    // Generate unique document ID
    const documentId = `doc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    // Store metadata in Neon PostgreSQL (default userId for now)
    await storeDocumentMetadata(documentId, 'default-user', title, filename);

    // Chunk text to fit Pinecone limits
    const chunks = chunkText(text);

    // Generate and store embeddings for each chunk
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const { embedding } = await embed({
        model: openai.embedding('text-embedding-3-large'),
        value: chunk,
      });

      // Store embedding in Pinecone
      await storeEmbedding(`${documentId}-${i}`, chunk, embedding, {
        title,
        filename,
      });
    }

    res.status(200).json({
      message: 'File uploaded, metadata and embeddings stored successfully',
      documentId,
      chunkCount: chunks.length,
      filename,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to process file or store data' });
  }
}