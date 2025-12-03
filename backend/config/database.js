import mysql from 'mysql2/promise'
import dotenv from 'dotenv';
dotenv.config();

// Database configuration with connection pool limits
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  // Connection pool configuration - using only confirmed valid mysql2 options
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 5,
  queueLimit: parseInt(process.env.DB_QUEUE_LIMIT) || 0
}

// Create connection pool
const pool = mysql.createPool(dbConfig)

// Test connection with better error handling
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection()
    console.log('Database connected successfully')
    console.log(`Connection pool: limit=${dbConfig.connectionLimit}, queueLimit=${dbConfig.queueLimit}`)
    connection.release()
    return true
  } catch (error) {
    console.error('Database connection failed:', error.message)
    if (error.code === 'ER_TOO_MANY_USER_CONNECTIONS') {
      console.error('Too many database connections. Consider reducing DB_CONNECTION_LIMIT or checking for connection leaks.')
    } else if (error.code === 'ETIMEDOUT' || error.errno === 'ETIMEDOUT') {
      console.error('Database connection timeout. Check network connectivity.')
    }
    return false
  }
}

// Graceful shutdown function to close pool connections
export const closePool = async () => {
  try {
    await pool.end()
    console.log('Database connection pool closed successfully')
  } catch (error) {
    console.error('Error closing database pool:', error.message)
  }
}

export default pool