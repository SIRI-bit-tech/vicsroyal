import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/vics_royal_beauty';

// Use Neon Serverless HTTP connection for low latency and zero connection-exhaustion
const sql = neon(connectionString);
export const db = drizzle({ client: sql, schema });

