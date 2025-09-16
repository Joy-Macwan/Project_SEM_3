// Import database initialization
const { initDatabase } = require('./database/init');
const { generateMockData } = require('./database/mockData');

// Function to initialize application
async function initialize() {
  try {
    // Initialize database
    await initDatabase();
    
    // Check if we need to generate mock data (can be triggered via environment variable)
    if (process.env.GENERATE_MOCK_DATA === 'true') {
      console.log('Generating mock data as requested...');
      await generateMockData();
    }
    
    console.log('Application initialized successfully');
  } catch (error) {
    console.error('Error initializing application:', error);
    process.exit(1);
  }
}

module.exports = { initialize };