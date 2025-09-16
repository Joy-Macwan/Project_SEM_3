#!/usr/bin/env node

/**
 * Database initialization script
 * This script will initialize the database and optionally seed it with mock data
 * 
 * Usage:
 *   node ./scripts/db-init.js [options]
 * 
 * Options:
 *   --reset        Reset the database (drop all tables)
 *   --mock-data    Generate mock data
 *   --help         Display help
 */

const { initDatabase } = require('../src/database/init');
const { generateMockData } = require('../src/database/mockData');
const sequelize = require('../src/database/connection');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  reset: args.includes('--reset'),
  mockData: args.includes('--mock-data'),
  help: args.includes('--help')
};

// Display help if requested
if (options.help) {
  console.log(`
Database Initialization Script

Usage:
  node ./scripts/db-init.js [options]

Options:
  --reset        Reset the database (drop all tables)
  --mock-data    Generate mock data
  --help         Display help
  `);
  process.exit(0);
}

// Main function
async function main() {
  try {
    // Check if reset is requested
    if (options.reset) {
      console.log('Resetting database...');
      await sequelize.drop();
      console.log('Database reset completed.');
    }
    
    // Initialize database
    console.log('Initializing database...');
    await initDatabase();
    
    // Generate mock data if requested
    if (options.mockData) {
      console.log('Generating mock data...');
      await generateMockData();
      console.log('Mock data generation completed.');
    }
    
    console.log('Database initialization completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error during database initialization:', error);
    process.exit(1);
  }
}

// Run the main function
main();