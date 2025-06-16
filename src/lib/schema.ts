import { pgTable, text, serial } from 'drizzle-orm/pg-core';

export const documents = pgTable('documents', {
  id: serial('id').primaryKey(),
  document_id: text('document_id').notNull().unique(),
  title: text('title').notNull(),
  filename: text('filename').notNull(),
});