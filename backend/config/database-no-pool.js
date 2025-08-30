import mysql from 'mysql2/promise'

// Database configuration without connection pooling
const dbConfig = {
  host: process.env.DB_HOST || '192.250.227.239',
  user: process.env.DB_USER || 'warriorc_admindb',
  password: process.env.DB_PASSWORD || 'StayFit2025!',
  database: process.env.DB_NAME || 'warriorc_db',
  port: process.env.DB_PORT || 3306
}

// Create individual connections instead of pool
const createConnection = async () => {
  return await mysql.createConnection(dbConfig)
}

// Mock pool interface for compatibility with existing code
const pool = {
  // Execute a query using a new connection each time
  async execute(sql, params) {
    let connection = null
    try {
      connection = await createConnection()
      const result = await connection.execute(sql, params)
      return result
    } finally {
      if (connection) {
        await connection.end()
      }
    }
  },

  // Get a connection (for compatibility with testConnection function)
  async getConnection() {
    const connection = await createConnection()
    // Add release method for compatibility
    connection.release = async () => {
      await connection.end()
    }
    return connection
  },

  // End all connections (no-op since we create individual connections)
  async end() {
    console.log('No-pooled connections closed successfully')
  }
}

// Test connection with better error handling
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection()
    console.log('Database connected successfully')
    console.log('Using individual connections (no pooling)')
    connection.release()
    return true
  } catch (error) {
    console.error('Database connection failed:', error.message)
    if (error.code === 'ER_TOO_MANY_USER_CONNECTIONS') {
      console.error('Too many database connections. Consider checking for connection leaks.')
    } else if (error.code === 'ETIMEDOUT' || error.errno === 'ETIMEDOUT') {
      console.error('Database connection timeout. Check network connectivity.')
    }
    return false
  }
}

// Graceful shutdown function (no-op for individual connections)
export const closePool = async () => {
  try {
    await pool.end()
    console.log('Database connections closed successfully')
  } catch (error) {
    console.error('Error closing database connections:', error.message)
  }
}

export default pool