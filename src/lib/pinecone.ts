// src/lib/pinecone.ts
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const indexName = process.env.PINECONE_INDEX_NAME!;

export async function storeEmbedding(
  vectorId: string,
  text: string,
  embedding: number[],
  metadata: { documentId: string; title: string; filename: string; text: string }
) {
  const index = pinecone.index(indexName);
  try {
    console.log(`Storing embedding for vector ${vectorId} in index ${indexName} (namespace: default) with metadata:`, metadata);
    await index.upsert([
      {
        id: vectorId,
        values: embedding,
        metadata: { ...metadata },
      },
    ]);
    console.log(`Successfully stored embedding for vector ${vectorId}`);
  } catch (error) {
    console.error('Error storing embedding:', error);
    throw new Error('Failed to store embedding');
  }
}

export function getIndex() {
  console.log(`Accessing Pinecone index ${indexName} (namespace: default)`);
  return pinecone.index(indexName);
}