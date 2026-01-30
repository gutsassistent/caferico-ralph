import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let _db: PostgresJsDatabase<typeof schema> | null = null;

export function getDb(): PostgresJsDatabase<typeof schema> {
  if (_db) return _db;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is not set. Add it to your .env.local file. ' +
      'Format: postgres://user:password@host:5432/database'
    );
  }

  const client = postgres(connectionString, { max: 1 });
  _db = drizzle(client, { schema });
  return _db;
}
