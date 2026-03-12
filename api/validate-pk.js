module.exports = function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
};
