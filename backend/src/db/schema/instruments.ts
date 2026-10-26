import {
  pgTable,
  text,
  bigint,
  primaryKey,
  integer,
  boolean,
  uniqueIndex,
  timestamp,
  check,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { id, cents, fk } from './helpers.ts'
import { instrumentTypeEnum, intervalEnum } from './enums'
import { users } from './users.ts'

export const instruments = pgTable(
  'instruments',
  {
    id: id(),
    isin: text('isin').notNull(), // 12-char international identifier
    wkn: text('wkn'), // German identifier
    symbol: text('symbol').notNull(),
    venue: text('venue').notNull(),
    name: text('name').notNull(),
    type: instrumentTypeEnum('type').notNull().default('STOCK'),
    currency: text('currentcy').notNull().default('EUR'),
    tickSize: integer('tick_size').notNull().default(1), // minimum price step, in cents
    isActive: boolean('is_active').notNull().default(true),
  },
  (table) => [
    uniqueIndex('instruments_isin_venue_uq').on(table.isin, table.venue),
  ],
)

export const candles = pgTable(
  'candles',
  {
    instrumentId: id()
      .notNull()
      .references(() => instruments.id, { onDelete: 'restrict' }),
    interval: intervalEnum('interval').notNull(),
    ts: timestamp('ts', { withTimezone: true }).notNull(),
    open: cents('open').notNull(),
    high: cents('high').notNull(),
    low: cents('low').notNull(),
    close: cents('close').notNull(),
    volume: bigint('volume', { mode: 'number' }).notNull().default(0),
  },
  (table) => [
    primaryKey({ columns: [table.instrumentId, table.interval, table.ts] }),
  ],
)

export const holdings = pgTable(
  'holdings',
  {
    id: id(),
    userId: fk('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    instrumentId: fk('instrument_id')
      .notNull()
      .references(() => instruments.id, { onDelete: 'restrict' }),
    quantity: integer('quantity').notNull().default(0),
    avgPrice: cents('avg_price').notNull().default(0), // average cost per share, in cents
    realizedPnl: cents('realized_pnl').notNull().default(0), // profit/loss locked in by sells
  },
  (t) => [
    uniqueIndex('holdings_user_instrument_uq').on(t.userId, t.instrumentId),
    check('holdings_quantity_nonneg', sql`${t.quantity} >= 0`),
  ],
)
