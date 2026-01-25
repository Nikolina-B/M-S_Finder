import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema'; // Zadržavamo tvoju shemu

// Učitava .env ili .env.local varijable
config({ path: '.env.local' }); 

// Profesorova konfiguracija za Supabase Transaction pooler (port 6543)
const client = postgres(process.env.DATABASE_URL!, {
  max: 1, 
  idle_timeout: 20,
  max_lifetime: 60 * 30,
  connect_timeout: 10,
  prepare: false, // OBAVEZNO dodaj ovo za Supabase pooler
});

// Izvoziš db s uključenom shemom kako bi Better Auth i Drizzle radili zajedno
export const db = drizzle(client, { schema });