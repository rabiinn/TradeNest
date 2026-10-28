import { Router } from 'express'
import { sayHello } from './auth.controller.ts'

const authRouter = Router()

authRouter.get('/hello', sayHello)

export default authRouter
