import { pgTable, text, timestamp, index, uuid } from 'drizzle-orm/pg-core'
import { createdAt, fk, id } from './helpers.ts'
import { userStatus } from './enums.ts'
import { sql } from 'drizzle-orm'
export const users = pgTable('users', {
  id: id(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  status: userStatus('user_status').notNull().default('ACTIVE'),
  createdAt: createdAt(),
})

export type User = typeof users.$inferSelect

export const refreshTokens = pgTable(
  'refresh_tokens',
  {
    id: id(),
    userId: fk('user_id').references(() => users.id, {
      onDelete: 'cascade',
    }),
    familyId: uuid('family_id').default(sql`uuidv7()`),
    tokenHash: text('token_hash').notNull().unique(),
    userAgent: text('user_agent'),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    createdAt: createdAt(),
  },
  (table) => [index('refresh_tokens_user_idx').on(table.userId)],
)
