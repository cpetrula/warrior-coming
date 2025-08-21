import mysql from 'mysql2/promise'

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'warriorc_db',
  port: process.env.DB_PORT || 3306,
}

// Create connection pool
const pool = mysql.createPool(dbConfig)

// Test connection
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection()
    console.log('Database connected successfully')
    connection.release()
    return true
  } catch (error) {
    console.error('Database connection failed:', error.message)
    return false
  }
}

export default pool