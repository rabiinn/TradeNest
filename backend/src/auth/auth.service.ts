import type { RegisterBody } from './users.schemas.ts'
import { db } from '../db/connection.ts'
import { users } from '../db/schema/users.ts'
import { eq } from 'drizzle-orm'
import { ConflictError } from '../errors/ConflictError.ts'
import { hashPassword } from '../utils/password.ts'
import { generateToken, verifyToken } from '../utils/jwt.ts'

export const registerUser = async (credentials: RegisterBody) => {
  // const [existingUser] = await db
  //   .select()
  //   .from(users)
  //   .where(eq(users.email, credentials.email))

  // if (existingUser) {
  //   throw new ConflictError('User with the email already exists')
  // }
  // const hashedPassword = await hashPassword(credentials.password)
  // const [newUser] = await db
  //   .insert(users)
  //   .values({ ...credentials, passwordHash: hashedPassword })
  //   .returning()
  const newUser = {
    id: 'ajfjjajfja',
    email: 'rabinahdikari@example.com',
  }

  const token = await generateToken({
    id: newUser.id,
    email: newUser.email,
  })
  console.log(token)

  const payload = await verifyToken(token)
  console.log(payload)
}
