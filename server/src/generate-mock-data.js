const sequelize = require('./database/connection');
const { generateMockData } = require('./database/mockData');

async function generateData() {
  try {
    console.log('Testing database connection...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    console.log('Generating mock data...');
    await generateMockData();
    console.log('Mock data generation complete!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error generating mock data:', error);
    process.exit(1);
  }
}

generateData();