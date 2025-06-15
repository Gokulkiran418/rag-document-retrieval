// src/lib/db.ts
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import { documents } from '@/lib/schema';

const db = drizzle(sql);

export async function storeDocumentMetadata(
  documentId: string,
  userId: string,
  title: string,
  filename: string
) {
  try {
    const [doc] = await db
      .insert(documents)
      .values({
        documentId,
        userId,
        title,
        filename,
      })
      .returning();
    console.log(`Stored metadata for document ${documentId}`);
    return doc;
  } catch (error) {
    console.error('Error storing metadata:', error);
    throw new Error('Failed to store document metadata');
  }
}