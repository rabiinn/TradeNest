import { pgTable, integer, primaryKey, text } from 'drizzle-orm/pg-core'
import { id, fk } from './helpers.ts'
import { users } from './users.ts'
import { instruments } from './instruments.ts'

export const watchlists = pgTable('watchlists', {
  id: id(),
  userId: fk('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  position: integer('position').notNull().default(0),
})

export const watchlistItems = pgTable(
  'watchlist_items',
  {
    watchlistId: fk('watchlist_id')
      .notNull()
      .references(() => watchlists.id, { onDelete: 'cascade' }),
    instrumentId: fk('instrument_id')
      .notNull()
      .references(() => instruments.id, { onDelete: 'cascade' }),
    position: integer('position').notNull().default(0),
  },
  (table) => [primaryKey({ columns: [table.watchlistId, table.instrumentId] })],
)
