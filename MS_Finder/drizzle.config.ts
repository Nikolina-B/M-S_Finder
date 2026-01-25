import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Učitaj varijable iz .env.local
dotenv.config({ path: '.env.local' });

export default defineConfig({
  // Putanje do tvojih shema
  schema: ['./app/lib/db/auth-schema.ts', './app/lib/db/schema.ts'],
  out: './app/lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    // Sada će process.env.DATABASE_URL biti ispravno učitan
    url: process.env.DATABASE_URL!,
  },
  // Ovo dodajemo kako bi Drizzle bio siguran pri radu sa Supabase-om
  verbose: true,
  strict: true,
});