import { User } from '../db/schema/users.ts'
import { UserResponse } from './users.schemas.ts'

export const toUserResponse = (u: User): UserResponse => ({
  id: u.id,
  email: u.email,
  firstName: u.firstName,
  lastName: u.lastName,
  status: u.status,
  createdAt: u.createdAt.toISOString(),
})
