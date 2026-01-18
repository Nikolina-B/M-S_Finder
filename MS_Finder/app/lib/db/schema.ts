import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  full_name: text('full_name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  created_at: timestamp('created_at').default(sql`now()`)
})
