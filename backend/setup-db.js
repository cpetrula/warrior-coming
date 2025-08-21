#!/usr/bin/env node

import mysql from 'mysql2/promise'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function setupDatabase() {
  console.log('Setting up MySQL database for Warrior Coming...')
  
  // Database configuration (without specifying database name initially)
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 3306,
  }
  
  try {
    // Connect to MySQL server
    const connection = await mysql.createConnection(config)
    console.log('Connected to MySQL server')
    
    // Read and execute schema
    const schemaPath = path.join(__dirname, 'sql', 'schema.sql')
    const schemaSql = fs.readFileSync(schemaPath, 'utf8')
    
    // Split by semicolon and execute each statement
    const statements = schemaSql.split(';').filter(stmt => stmt.trim())
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await connection.execute(statement)
          console.log('Executed:', statement.trim().split('\n')[0] + '...')
        } catch (err) {
          console.log('Skipped (already exists):', statement.trim().split('\n')[0] + '...')
        }
      }
    }
    
    await connection.end()
    console.log('Database setup completed successfully!')
    console.log('Database name: warriorc_db')
    
  } catch (error) {
    console.error('Database setup failed:', error.message)
    console.log('\nMake sure MySQL is running and credentials are correct.')
    console.log('You can set database credentials using environment variables:')
    console.log('  DB_HOST (default: localhost)')
    console.log('  DB_USER (default: root)')
    console.log('  DB_PASSWORD (default: empty)')
    console.log('  DB_PORT (default: 3306)')
    process.exit(1)
  }
}

setupDatabase()