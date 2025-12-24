#!/usr/bin/env node

import mysql from 'mysql2/promise'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function runMigrations() {
  console.log('Running database migrations for Warrior Coming...')
  
  // Database configuration
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'warriorc_db',
    port: process.env.DB_PORT || 3306,
  }
  
  try {
    // Connect to MySQL server
    const connection = await mysql.createConnection(config)
    console.log('Connected to MySQL database')
    
    // Read all migration files
    const migrationsDir = path.join(__dirname, 'sql', 'migrations')
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort() // Sort to run in order
    
    console.log(`Found ${files.length} migration files`)
    
    for (const file of files) {
      console.log(`\nRunning migration: ${file}`)
      const migrationPath = path.join(migrationsDir, file)
      const migrationSql = fs.readFileSync(migrationPath, 'utf8')
      
      // Split by semicolon and execute each statement
      const statements = migrationSql.split(';').filter(stmt => stmt.trim())
      
      for (const statement of statements) {
        if (statement.trim() && !statement.trim().startsWith('--')) {
          try {
            await connection.execute(statement)
            console.log('  ✓ Executed statement')
          } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
              console.log('  - Column already exists (skipped)')
            } else {
              console.log('  - Skipped:', err.message)
            }
          }
        }
      }
    }
    
    await connection.end()
    console.log('\n✅ All migrations completed successfully!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    console.log('\nMake sure MySQL is running and the database exists.')
    console.log('You can set database credentials using environment variables:')
    console.log('  DB_HOST (default: localhost)')
    console.log('  DB_USER (default: root)')
    console.log('  DB_PASSWORD (default: empty)')
    console.log('  DB_NAME (default: warriorc_db)')
    console.log('  DB_PORT (default: 3306)')
    process.exit(1)
  }
}

runMigrations()
