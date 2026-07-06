import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core'

export const links = pgTable('links', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  originalUrl: text('original_url').notNull(),
  code: text('code').notNull().unique(),
  clicks: integer('clicks').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})