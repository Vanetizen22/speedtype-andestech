import {
  boolean,
  date,
  doublePrecision,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

export const sessionStatusEnum = pgEnum('session_status', ['draft', 'active', 'closed'])

export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  location: text('location').notNull(),
  eventDate: date('event_date', { mode: 'date' }).notNull(),
  status: sessionStatusEnum('status').notNull().default('draft'),
  isActive: boolean('is_active').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const results = pgTable('results', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionId: uuid('session_id')
    .notNull()
    .references(() => sessions.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  text: text('text').notNull(),
  socialHandle: text('social_handle'),
  timeSeconds: doublePrecision('time_seconds'),
  errors: integer('errors').notNull().default(0),
  wpm: integer('wpm').notNull().default(0),
  completed: boolean('completed').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const adminSessions = pgTable('admin_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  tokenHash: text('token_hash').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
})

export type SessionRow = typeof sessions.$inferSelect
export type ResultRow = typeof results.$inferSelect
export type AdminSessionRow = typeof adminSessions.$inferSelect