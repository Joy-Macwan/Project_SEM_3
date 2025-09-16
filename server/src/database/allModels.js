// Import model files
const models = require('./modelsFixed');
const additionalModels = require('./additionalModelsFixed');

// Combine all models into one export
module.exports = { ...models, ...additionalModels };