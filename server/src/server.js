const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Database connection
const db = require('./database/connection');

// Import initialization script
const { initialize } = require('./init');

// Import Express app
const app = require('./app');

// Start the server
const PORT = process.env.PORT || 5000;

// Initialize the application and then start the server
initialize().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log(`Server accessible at http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize application:', err);
  process.exit(1);
});

module.exports = app;