import { pgTable, uuid, text, timestamp, index } from 'drizzle-orm/pg-core'
import { createdAt, id } from './helpers.ts'
export const users = pgTable('users', {
  id: id(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  status: text('status').notNull().default('active'),
  createdAt: createdAt(),
})

export const refreshTokens = pgTable(
  'refresh_token',
  {
    id: id(),
    userId: id().references(() => users.id, {
      onDelete: 'cascade',
    }),
    tokenHash: text('token_hash').notNull().unique(),
    userAgent: text('user_agent'),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    createdAt: createdAt(),
  },
  (table) => [index('refresh_tokens_user_idx').on(table.userId)],
)
