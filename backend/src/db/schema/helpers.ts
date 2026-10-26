import { timestamp, uuid, bigint } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const id = () =>
  uuid('id')
    .primaryKey()
    .default(sql`uuidv7()`)
export const createdAt = () =>
  timestamp('created_at', { withTimezone: true }).defaultNow().notNull()

export const cents = (name: string) => bigint(name, { mode: 'number' })
