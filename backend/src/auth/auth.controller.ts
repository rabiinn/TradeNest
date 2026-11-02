import type { Request, Response } from 'express'
import { loginUser, refreshSession, registerUser } from './auth.service.ts'

export const register = async (req: Request, res: Response) => {
  const result = await registerUser(req.body)
  res.status(201).json({
    message: 'User registered',
    ...result,
  })
}

export const login = async (req: Request, res: Response) => {
  const { user, accessToken } = await loginUser(req.body)
  res.status(201).json({ message: 'User logged in', user, accessToken })
}

export const refresh = async (req: Request, res: Response) => {
  const result = await refreshSession('token', 'agent')
  res.status(200).json({ message: 'Refreshed ', ...result })
}
