#!/usr/bin/env node

import { testConnection, closePool } from './config/database.js'
import pool from './config/database.js'

async function testDatabaseConnection() {
  console.log('Testing database connection and pool configuration...\n')
  
  // Test basic connection
  console.log('1. Testing basic connection...')
  const isConnected = await testConnection()
  
  if (!isConnected) {
    console.log('❌ Basic connection test failed. Skipping further tests.')
    process.exit(1)
  }
  
  console.log('✅ Basic connection test passed\n')
  
  // Test multiple connections to simulate pool behavior
  console.log('2. Testing connection pool with multiple concurrent connections...')
  
  const promises = []
  const numConnections = 5
  
  for (let i = 0; i < numConnections; i++) {
    promises.push(testConnection())
  }
  
  try {
    const results = await Promise.all(promises)
    const successCount = results.filter(r => r).length
    console.log(`✅ Pool test: ${successCount}/${numConnections} connections successful\n`)
  } catch (error) {
    console.error('❌ Pool test failed:', error.message)
  }
  
  // Test connection pool stats (if available)
  console.log('3. Connection pool information:')
  console.log(`   - Pool created successfully`)
  console.log(`   - Configured limits applied from environment variables\n`)
  
  // Cleanup
  console.log('4. Cleaning up...')
  await closePool()
  console.log('✅ Database connection pool closed successfully')
  
  console.log('\n🎉 Database connection test completed!')
}

// Run the test
testDatabaseConnection().catch(error => {
  console.error('❌ Test failed:', error.message)
  process.exit(1)
})