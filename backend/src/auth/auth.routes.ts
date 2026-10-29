import { Router } from 'express'
import { register } from './auth.controller.ts'

const authRouter = Router()

authRouter.get('/register', register)
export default authRouter
