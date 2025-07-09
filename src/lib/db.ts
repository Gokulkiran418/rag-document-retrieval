// src/lib/db.ts
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

const sql = neon(process.env.POSTGRES_URL!);
export const db = drizzle(sql, { schema });

export async function storeDocumentMetadata({
  documentId,
  title,
  filename,
}: {
  documentId: string;
  title: string;
  filename: string;
}) {
  try {
    await db
      .insert(schema.documents)
      .values({
        document_id: documentId,
        title,
        filename,
      })
      .execute();
  } catch (error) {
    console.error('Error storing metadata:', error);
    throw new Error('Failed to store document metadata');
  }
}