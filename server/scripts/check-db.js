const sequelize = require('../src/database/connection');

async function checkDatabase() {
  try {
    // Get all tables in the database
    const [results] = await sequelize.query(`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name;
    `);
    
    console.log('Tables in the database:');
    results.forEach(table => {
      console.log(`- ${table.name}`);
    });
    
    // Get count of records in important tables
    const tables = ['Users', 'Products', 'Orders', 'Carts', 'Addresses', 'Wishlists'];
    
    console.log('\nRecord counts:');
    for (const table of tables) {
      try {
        const [countResult] = await sequelize.query(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`- ${table}: ${countResult[0].count} records`);
      } catch (error) {
        console.log(`- ${table}: Error - ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await sequelize.close();
  }
}

checkDatabase();