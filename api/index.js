const express = require('express');
const Stripe = require('stripe');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// ── API: Fetch Stripe account details ────────
app.post('/api/account', async (req, res) => {
  const { secretKey } = req.body;

  if (!secretKey) {
    return res.status(400).json({ error: 'Secret key is required' });
  }

  try {
    const stripe = new Stripe(secretKey);

    // Fetch account details
    const account = await stripe.accounts.retrieve();

    // Fetch balance
    const balance = await stripe.balance.retrieve();

    // Fetch recent charges (last 5)
    const charges = await stripe.charges.list({ limit: 5 });

    // Fetch recent payouts (last 5)
    let payouts = { data: [] };
    try {
      payouts = await stripe.payouts.list({ limit: 5 });
    } catch (e) {
      // Payouts may not be available for all account types
    }

    // Fetch active products count
    let products = { data: [] };
    try {
      products = await stripe.products.list({ limit: 100, active: true });
    } catch (e) {
      // Products may not be available
    }

    // Fetch customers count
    let customers = { data: [] };
    try {
      customers = await stripe.customers.list({ limit: 100 });
    } catch (e) {
      // Customers may not be available
    }

    return res.status(200).json({
      account,
      balance,
      charges: charges.data,
      payouts: payouts.data,
      productsCount: products.data.length,
      customersCount: customers.data.length,
    });
  } catch (error) {
    console.error('Stripe API Error:', error.message);
    return res.status(error.statusCode || 500).json({
      error: error.message || 'Failed to fetch account details',
      type: error.type || 'api_error',
    });
  }
});

// ── API: Validate publishable key ────────────
app.post('/api/validate-pk', (req, res) => {
  const { publishableKey } = req.body;

  if (!publishableKey) {
    return res.status(400).json({ error: 'Publishable key is required' });
  }

  const isLive = publishableKey.startsWith('pk_live_');
  const isTest = publishableKey.startsWith('pk_test_');

  return res.status(200).json({
    valid: isLive || isTest,
    mode: isLive ? 'live' : isTest ? 'test' : 'unknown',
    key: publishableKey.substring(0, 12) + '...' + publishableKey.slice(-4),
  });
});

// ── Serve index.html for all other routes ────
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Local dev server (ignored by Vercel)
app.listen(3000, () => {
  console.log(`\n  🚀 Stripe Account Inspector is running!`);
  console.log(`  ➜ Open http://localhost:3000 in your browser\n`);
});

module.exports = app;
