import { Router } from 'express'
import { login, refresh, register } from './auth.controller.ts'
import { validateBody } from '../middleware/validationMiddleware.ts'
import { loginSchema, registerSchema } from './users.schemas.ts'
const authRouter = Router()
authRouter.post('/register', validateBody(registerSchema), register)
authRouter.post('/login', validateBody(loginSchema), login)
authRouter.post('/refresh', refresh)
export default authRouter
