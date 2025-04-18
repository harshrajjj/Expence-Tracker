// Import the Express app
const app = require('./index');

// Export a serverless function handler
module.exports = (req, res) => {
  // Forward the request to the Express app
  app(req, res);
};
