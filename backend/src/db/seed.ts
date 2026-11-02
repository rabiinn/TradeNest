import { db } from './connection.ts'
import { hashPassword } from '../utils/password.ts'
import { users } from './schema/users.ts'

const seedUsers = [
  {
    email: 'anna.schmidt@example.com',
    firstName: 'Anna',
    lastName: 'Schmidt',
    password: 'password123',
  },
  {
    email: 'lukas.mueller@example.com',
    firstName: 'Lukas',
    lastName: 'Müller',
    password: '12345',
  },
  {
    email: 'sofia.weber@example.com',
    firstName: 'Sofia',
    lastName: 'Weber',
    password: 'password123',
  },
  {
    email: 'jonas.fischer@example.com',
    firstName: 'Jonas',
    lastName: 'Fischer',
    password: 'password123',
  },
  {
    email: 'mia.becker@example.com',
    firstName: 'Mia',
    lastName: 'Becker',
    password: 'password123',
  },
  {
    email: 'leon.hoffmann@example.com',
    firstName: 'Leon',
    lastName: 'Hoffmann',
    password: 'password123',
  },
]

const DEV_PASSWORD = 'password123'

async function seed() {
  await db.transaction(async (tx) => {
    await tx.delete(users)

    await tx.insert(users).values(
      await Promise.all(
        seedUsers.map(async (u) => ({
          ...u,
          passwordHash: await hashPassword(DEV_PASSWORD),
        })),
      ),
    )
  })
}

seed()
  .then(() => {
    console.log('Seeded users')
    process.exit(0)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
