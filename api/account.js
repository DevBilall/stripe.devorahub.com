const Stripe = require('stripe');

module.exports = async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
};
