import { Router } from 'express'
import { login, register } from './auth.controller.ts'

const authRouter = Router()

authRouter.get('/register', register)
authRouter.get('/login', login)
export default authRouter
