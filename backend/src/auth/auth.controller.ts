import type { Request, Response } from 'express'
import { loginUser, registerUser } from './auth.service.ts'

export const register = async (req: Request, res: Response) => {
  const registeredUser = await registerUser({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'Password123!',
    status: 'ACTIVE',
  })
  res.status(200).json({ registeredUser })
}

export const login = async (req: Request, res: Response) => {
  const user = await loginUser({
    email: 'john.doe@example.com',
    password: 'helllo',
  })

  res.status(200).json({ message: 'Okay' })
}
