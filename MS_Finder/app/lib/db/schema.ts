import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { user } from './auth-schema'

// export const users = pgTable('users', {
//   id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
//   full_name: text('full_name').notNull(),
//   email: text('email').notNull().unique(),
//   password: text('password').notNull(),
//   created_at: timestamp('created_at').default(sql`now()`)
// })

export const watchlist = pgTable('watchlist',{
    id: text("id").primaryKey(),
    userId: text("userId").notNull().references(() => user.id),
    movieId: text("movieId").notNull(),
    title: text("title").notNull(),
    year: text("year"),
    genre: text("genre"),
    imdbRating: text("imdbRating"),
    poster: text("poster"),
    createdAt: timestamp("createdAt").defaultNow(),

})