const sequelize = require('./database/connection');
const fs = require('fs');
const path = require('path');
const { initDatabase } = require('./database/init');

async function setupDatabase() {
  try {
    console.log('Testing database connection...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Check if database file exists
    const dbPath = path.join(__dirname, '..', 'database', 'repair_reuse_reduce.sqlite');
    const dbExists = fs.existsSync(dbPath);
    
    if (dbExists) {
      const stats = fs.statSync(dbPath);
      const fileSizeInBytes = stats.size;
      console.log(`Database file exists (${fileSizeInBytes} bytes).`);
      
      if (fileSizeInBytes > 0) {
        console.log('Using existing database.');
        
        // Just verify tables
        const [results] = await sequelize.query("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
        
        console.log('Tables in the database:');
        if (results.length > 0) {
          results.forEach((table, index) => {
            console.log(`${index + 1}. ${table.name}`);
          });
        } else {
          console.log('No tables found. Initializing database...');
          await initDatabase();
        }
      } else {
        console.log('Database file exists but is empty. Initializing database...');
        await initDatabase();
      }
    } else {
      console.log('Database file does not exist. Creating and initializing database...');
      await initDatabase();
    }

    console.log('\nDatabase setup completed successfully!');
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();