import type { Config } from 'drizzle-kit';
import { env } from '~/env.mjs';

export default {
  schema: './src/db/schema.ts',
  out: './db/migrations',
  driver: 'turso',
  dbCredentials: {
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  },
  dialect: 'sqlite',
} satisfies Config;
