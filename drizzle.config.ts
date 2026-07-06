import { defineConfig } from 'drizzle-kit';
import { env } from './src/env.js';

export default defineConfig({
  schema: 'src/infra/db/schemas/index.ts',
  out: './src/infra/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});