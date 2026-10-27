import { relations } from 'drizzle-orm'
import {
  users,
  refreshTokens,
  instruments,
  candles,
  watchlists,
  watchlistItems,
  fundsLedger,
  orders,
  trades,
  holdings,
  auditLog,
} from './index.ts'

export const userRelations = relations(users, ({ many }) => ({
  refreshTokens: many(refreshTokens),
  watchlists: many(watchlists),
  ledger: many(fundsLedger),
  orders: many(orders),
  trades: many(trades),
  holdings: many(holdings),
  auditEntries: many(auditLog),
}))

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.id],
  }),
}))

export const instrumentsRelations = relations(instruments, ({ many }) => ({
  candles: many(candles),
  watchlistItems: many(watchlistItems),
  orders: many(orders),
  trades: many(trades),
  holdings: many(holdings),
}))

export const candlesRelations = relations(candles, ({ one }) => ({
  instrument: one(instruments, {
    fields: [candles.instrumentId],
    references: [instruments.id],
  }),
}))

export const watchlistsRelations = relations(watchlists, ({ one, many }) => ({
  user: one(users, {
    fields: [watchlists.userId],
    references: [users.id],
  }),
  items: many(watchlistItems),
}))

export const watchlistItemsRelations = relations(watchlistItems, ({ one }) => ({
  watchlist: one(watchlists, {
    fields: [watchlistItems.watchlistId],
    references: [watchlists.id],
  }),
  instrument: one(instruments, {
    fields: [watchlistItems.instrumentId],
    references: [instruments.id],
  }),
}))

export const fundsLedgerRelation = relations(fundsLedger, ({ one }) => ({
  user: one(users, {
    fields: [fundsLedger.userId],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [fundsLedger.orderId],
    references: [orders.id],
  }),
  trade: one(trades, {
    fields: [fundsLedger.tradeId],
    references: [trades.id],
  }),
}))

export const orderRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  instrument: one(instruments, {
    fields: [orders.instrumentId],
    references: [instruments.id],
  }),
}))

export const tradesRelations = relations(trades, ({ one }) => ({
  order: one(orders, {
    fields: [trades.orderId],
    references: [orders.id],
  }),
  user: one(users, {
    fields: [trades.userId],
    references: [users.id],
  }),
  instrument: one(instruments, {
    fields: [trades.instrumentId],
    references: [instruments.id],
  }),
}))

export const holdingsRelations = relations(holdings, ({ one }) => ({
  user: one(users, {
    fields: [holdings.userId],
    references: [users.id],
  }),
}))

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  user: one(users, { fields: [auditLog.userId], references: [users.id] }),
}))
