// src/lib/pinecone.ts
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const indexName = process.env.PINECONE_INDEX_NAME!;

export async function storeEmbedding(
  documentId: string,
  text: string,
  embedding: number[],
  metadata: { title: string; filename: string }
) {
  const index = pinecone.index(indexName);
  try {
    await index.upsert([
      {
        id: documentId,
        values: embedding,
        metadata: { ...metadata, text },
      },
    ]);
    console.log(`Stored embedding for document ${documentId}`);
  } catch (error) {
    console.error('Error storing embedding:', error);
    throw new Error('Failed to store embedding');
  }
}

export function getIndex() {
  return pinecone.index(indexName);
}