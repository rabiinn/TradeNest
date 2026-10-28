import express from 'express'
import helmet from 'helmet'
import type { Request, Response } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import authRouter from './auth/auth.routes.ts'
import { errorHandler } from './middleware/error.handler.ts'
import { env, isTestEnv } from '../env.ts'
const app = express()

app.use(helmet())
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  morgan('dev', {
    skip: () => isTestEnv(),
  }),
)

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'TradeNest API',
  })
})

app.use('/api/auth', authRouter)
app.get('/sync-error', (req, res) => {
  throw new Error('Something went wrong')
})
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
  })
})
app.use(errorHandler)

export default app
