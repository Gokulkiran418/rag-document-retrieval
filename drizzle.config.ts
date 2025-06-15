// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

config({ path: '.env.local' });

export default defineConfig({
  schema: './src/lib/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL_NON_POOLING!,
  },
  verbose: true,
});