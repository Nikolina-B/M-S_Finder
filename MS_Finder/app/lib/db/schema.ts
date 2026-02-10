import { pgTable, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core'
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

});

export const favorites = pgTable('favorites',{
    id: text("id").primaryKey(),
    userId: text("userId").notNull().references(() => user.id),
    movieId: text("movieId").notNull(),
    title: text("title").notNull(),
    year: text("year"),
    genre: text("genre"),
    imdbRating: text("imdbRating"),
    poster: text("poster"),
    createdAt: timestamp("createdAt").defaultNow(),

});

export const contact_messages = pgTable('contact_messages',{
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("userId").references(() => user.id).notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    message: text("message").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),

});
export const communities = pgTable('communities',{
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull().unique(),
    slug: text("slug").notNull().unique(),
    adminId: text("admin_id")
        .notNull()
        .references(() => user.id), 
    memberCount: integer("member_count").default(1),
    createdAt: timestamp("created_at").defaultNow(),

});
export const community_members = pgTable('community_members',{
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
    .notNull()
    .references(() => user.id),

    communityId: uuid("community_id")
    .notNull()
    .references(() => communities.id),

    joinedAt: timestamp("joined_at").defaultNow(),


});
