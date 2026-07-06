import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { env } from '../../env.js';

const migrationClient = postgres(env.DATABASE_URL, { max: 1 });

async function main() {
  const db = drizzle(migrationClient);
  await migrate(db, { migrationsFolder: './src/infra/db/migrations' });
  await migrationClient.end();
  process.exit(0);
}

main().catch((err) => {
  console.error('Migration failed', err);
  process.exit(1);
})