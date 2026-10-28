import express from 'express'
import helmet from 'helmet'
import type { Request, Response } from 'express'
import cors from 'cors'
import authRouter from './auth/auth.routes.ts'
const app = express()

app.use(helmet())
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'TradeNest API',
  })
})

app.use('/api/auth', authRouter)

app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
  })
})

export default app
