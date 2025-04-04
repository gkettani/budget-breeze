import type { Config } from 'drizzle-kit';
import { env } from '~/env.mjs';

export default {
  schema: './src/db/schema.ts',
  out: './db/migrations',
  dialect: 'turso',
  dbCredentials: {
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  },
} satisfies Config;
