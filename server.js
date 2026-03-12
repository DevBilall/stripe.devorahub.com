const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Import serverless handlers and wire them up for local dev
const accountHandler = require('./api/account');
const validatePkHandler = require('./api/validate-pk');

app.post('/api/account', (req, res) => accountHandler(req, res));
app.post('/api/validate-pk', (req, res) => validatePkHandler(req, res));

// Fallback to index.html for any other route (Express v5 syntax)
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n  🚀 Stripe Account Inspector is running!`);
  console.log(`  ➜ Open http://localhost:${PORT} in your browser\n`);
});
