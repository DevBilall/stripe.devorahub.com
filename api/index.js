// Re-export the Express app for Vercel's /api rewrite
const app = require('../server');
module.exports = app;
