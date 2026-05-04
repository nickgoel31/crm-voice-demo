import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    const result = await client.execute("UPDATE leads SET call_transcript = NULL WHERE call_transcript = '[object Object]'");
    console.log(`Cleaned up ${result.rowsAffected} records.`);
  } catch (err) {
    console.error(err);
  }
}

run();
