// pages/api/upload.ts
import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs/promises';
import pdfParse from 'pdf-parse';

// Disable Next.js body parsing to handle multipart form data
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable({ multiples: false, maxFileSize: 10 * 1024 * 1024 }); // 10MB limit
  try {
    const { files } = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
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

    // Return extracted text and filename
    res.status(200).json({ message: 'File uploaded successfully', text, filename: file.originalFilename });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to process file' });
  }
}