// src/lib/schema.ts
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const documents = pgTable('documents', {
  id: serial('id').primaryKey(),
  documentId: text('document_id').notNull().unique(), // Matches Pinecone documentId
  userId: text('user_id').notNull(), // Placeholder for future auth
  title: text('title').notNull(),
  filename: text('filename').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});