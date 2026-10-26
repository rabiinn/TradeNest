import { createPool } from './connection.ts'

const pool = createPool()

async function testConnection() {
  try {
    const ping = await pool.query('SELECT NOW() AS current_time')
    console.log('Connected successfully at: ', ping.rows[0].current_time)
  } catch (error) {
    console.error('Database connection or query error:', error)
  } finally {
    await pool.end()
  }
}

testConnection()
