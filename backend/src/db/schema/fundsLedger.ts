import { pgTable, index, uuid } from 'drizzle-orm/pg-core'
import { id, cents, createdAt, fk } from './helpers.ts'
import { users } from './users.ts'
import { ledgerTypeEnum } from './enums.ts'
import { orders, trades } from './trading.ts'
export const fundsLedger = pgTable(
  'funds_ledger',
  {
    id: id(),
    userId: fk('user_id')
      .notNull()
      .references(() => users.id),
    type: ledgerTypeEnum('type').notNull(),
    amount: cents('amount').notNull(), // always positive; type decides the direction
    orderId: uuid('order_id').references(() => orders.id),
    tradeId: uuid('trade_id').references(() => trades.id),
    balanceAfter: cents('balance_after').notNull(),
    createdAt: createdAt(),
  },
  (t) => [index('funds_ledger_user_idx').on(t.userId, t.createdAt)],
)
