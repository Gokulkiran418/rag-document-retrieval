import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema'; // Adjust path to your schema file

const sql = neon(process.env.POSTGRES_URL!); // Ensure env variable is set
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
    console.error("Error storing metadata:", error);
    throw new Error("Failed to store document metadata");
  }
}