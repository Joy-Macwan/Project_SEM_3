const sequelize = require('./database/connection');
const { initDatabase } = require('./database/init');

async function testDatabaseSetup() {
  try {
    console.log('Testing database connection...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    console.log('Initializing database...');
    await initDatabase();
    console.log('Database initialization complete.');

    // Get all model tables
    console.log('Checking tables...');
    const [results] = await sequelize.query("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
    
    console.log('Tables in the database:');
    results.forEach((table, index) => {
      console.log(`${index + 1}. ${table.name}`);
    });

    console.log('\nDatabase test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database test failed:', error);
    process.exit(1);
  }
}

testDatabaseSetup();