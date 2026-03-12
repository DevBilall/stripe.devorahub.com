// ── DOM Elements ──────────────────────────────
const skInput = document.getElementById('sk-input');
const skToggle = document.getElementById('sk-toggle');
const fetchBtn = document.getElementById('fetch-btn');
const errorMsg = document.getElementById('error-msg');
const modeBadge = document.getElementById('mode-badge');
const modeText = document.getElementById('mode-text');
const loadingSection = document.getElementById('loading-section');
const resultsSection = document.getElementById('results-section');
const rawToggle = document.getElementById('raw-toggle');
const rawJsonWrapper = document.getElementById('raw-json-wrapper');

// ── Toggle password visibility ────────────────
function setupToggle(input, btn) {
  btn.addEventListener('click', () => {
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    btn.style.color = isPassword ? 'var(--primary-light)' : 'var(--text-dim)';
  });
}
setupToggle(skInput, skToggle);

// ── Detect key mode from SK ──────────────────
function detectMode() {
  const sk = skInput.value.trim();

  if (!sk) {
    modeBadge.className = 'mode-badge';
    modeText.textContent = 'No Key Entered';
    return;
  }

  if (sk.includes('_live_')) {
    modeBadge.className = 'mode-badge live';
    modeText.textContent = 'Live Mode';
  } else if (sk.includes('_test_')) {
    modeBadge.className = 'mode-badge test';
    modeText.textContent = 'Test Mode';
  } else {
    modeBadge.className = 'mode-badge';
    modeText.textContent = 'Unknown Mode';
  }
}

skInput.addEventListener('input', detectMode);

// ── Show error ───────────────────────────────
function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.classList.add('visible');
  errorMsg.style.display = 'block';
}

function hideError() {
  errorMsg.classList.remove('visible');
  errorMsg.style.display = 'none';
}

// ── Format currency ─────────────────────────
function formatAmount(amount, currency = 'usd') {
  const val = amount / 100;
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(val);
  } catch {
    return `${val.toFixed(2)} ${currency.toUpperCase()}`;
  }
}

// ── Format date ─────────────────────────────
function formatDate(timestamp) {
  if (!timestamp) return '—';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp * 1000));
}

// ── Render account info ──────────────────────
function renderAccountInfo(account) {
  const grid = document.getElementById('account-info');
  const fields = [
    { label: 'Account ID', value: account.id, mono: true },
    { label: 'Business Name', value: account.business_profile?.name || account.settings?.dashboard?.display_name || '—' },
    { label: 'Email', value: account.email || '—' },
    { label: 'Country', value: account.country || '—' },
    { label: 'Default Currency', value: (account.default_currency || '—').toUpperCase() },
    { label: 'Business Type', value: capitalize(account.business_type) || '—' },
    { label: 'Charges Enabled', value: account.charges_enabled ? '✅ Yes' : '❌ No' },
    { label: 'Payouts Enabled', value: account.payouts_enabled ? '✅ Yes' : '❌ No' },
    { label: 'Details Submitted', value: account.details_submitted ? '✅ Yes' : '❌ No' },
    { label: 'Support Email', value: account.business_profile?.support_email || '—' },
    { label: 'Support Phone', value: account.business_profile?.support_phone || '—' },
    { label: 'Statement Descriptor', value: account.settings?.payments?.statement_descriptor || '—' },
  ];

  grid.innerHTML = fields.map(f => `
    <div class="info-item">
      <div class="info-label">${f.label}</div>
      <div class="info-value ${f.mono ? 'mono' : ''}">${f.value}</div>
    </div>
  `).join('');
}

// ── Render balance ───────────────────────────
function renderBalance(balance) {
  const grid = document.getElementById('balance-info');
  let html = '';

  if (balance.available && balance.available.length) {
    balance.available.forEach(b => {
      html += `
        <div class="balance-item available">
          <div class="balance-type">Available</div>
          <div class="balance-amount">${formatAmount(b.amount, b.currency)}</div>
          <div class="balance-currency">${b.currency.toUpperCase()}</div>
        </div>
      `;
    });
  }

  if (balance.pending && balance.pending.length) {
    balance.pending.forEach(b => {
      html += `
        <div class="balance-item pending">
          <div class="balance-type">Pending</div>
          <div class="balance-amount">${formatAmount(b.amount, b.currency)}</div>
          <div class="balance-currency">${b.currency.toUpperCase()}</div>
        </div>
      `;
    });
  }

  if (!html) {
    html = '<div class="no-data">No balance data available</div>';
  }

  grid.innerHTML = html;
}

// ── Render stats ─────────────────────────────
function renderStats(data) {
  const grid = document.getElementById('stats-info');
  const stats = [
    { icon: '📦', value: data.productsCount, label: 'Active Products' },
    { icon: '👥', value: data.customersCount, label: 'Customers' },
    { icon: '💳', value: data.charges.length, label: 'Recent Charges' },
    { icon: '🏦', value: data.payouts.length, label: 'Recent Payouts' },
  ];

  grid.innerHTML = stats.map(s => `
    <div class="stat-item">
      <div class="stat-icon">${s.icon}</div>
      <div class="stat-value">${s.value}</div>
      <div class="stat-label">${s.label}</div>
    </div>
  `).join('');
}

// ── Render charges table ─────────────────────
function renderCharges(charges) {
  const wrapper = document.getElementById('charges-info');

  if (!charges.length) {
    wrapper.innerHTML = '<div class="no-data">No recent charges found</div>';
    return;
  }

  let html = `
    <table class="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Description</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
  `;

  charges.forEach(c => {
    html += `
      <tr>
        <td style="font-family:monospace;font-size:0.78rem;color:var(--text-muted)">${c.id.substring(0, 20)}...</td>
        <td style="font-weight:600">${formatAmount(c.amount, c.currency)}</td>
        <td><span class="status-badge ${c.status}">${c.status}</span></td>
        <td>${c.description || '—'}</td>
        <td>${formatDate(c.created)}</td>
      </tr>
    `;
  });

  html += '</tbody></table>';
  wrapper.innerHTML = html;
}

// ── Render payouts table ─────────────────────
function renderPayouts(payouts) {
  const wrapper = document.getElementById('payouts-info');

  if (!payouts.length) {
    wrapper.innerHTML = '<div class="no-data">No recent payouts found</div>';
    return;
  }

  let html = `
    <table class="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Method</th>
          <th>Arrival Date</th>
        </tr>
      </thead>
      <tbody>
  `;

  payouts.forEach(p => {
    html += `
      <tr>
        <td style="font-family:monospace;font-size:0.78rem;color:var(--text-muted)">${p.id.substring(0, 20)}...</td>
        <td style="font-weight:600">${formatAmount(p.amount, p.currency)}</td>
        <td><span class="status-badge ${p.status}">${p.status}</span></td>
        <td>${capitalize(p.method) || '—'}</td>
        <td>${formatDate(p.arrival_date)}</td>
      </tr>
    `;
  });

  html += '</tbody></table>';
  wrapper.innerHTML = html;
}

// ── Utilities ────────────────────────────────
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
}

// ── Raw JSON Toggle ─────────────────────────
rawToggle.addEventListener('click', () => {
  const isOpen = rawJsonWrapper.style.display !== 'none';
  rawJsonWrapper.style.display = isOpen ? 'none' : 'block';
  rawToggle.querySelector('.toggle-arrow').classList.toggle('open', !isOpen);
});

// ── Fetch Account Details ────────────────────
fetchBtn.addEventListener('click', async () => {
  hideError();

  const sk = skInput.value.trim();

  if (!sk) {
    showError('Please enter your Secret Key (sk_live_... or sk_test_...)');
    return;
  }

  if (!sk.startsWith('sk_live_') && !sk.startsWith('sk_test_') && !sk.startsWith('rk_live_') && !sk.startsWith('rk_test_')) {
    showError('Invalid secret key format. It should start with sk_live_, sk_test_, rk_live_, or rk_test_');
    return;
  }

  // Show loading
  fetchBtn.disabled = true;
  resultsSection.style.display = 'none';
  loadingSection.style.display = 'block';

  try {
    const response = await fetch('/api/account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secretKey: sk }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch account details');
    }

    // Render all sections
    renderAccountInfo(data.account);
    renderBalance(data.balance);
    renderStats(data);
    renderCharges(data.charges);
    renderPayouts(data.payouts);

    // Raw JSON
    document.getElementById('raw-json').textContent = JSON.stringify(data.account, null, 2);

    // Show results
    loadingSection.style.display = 'none';
    resultsSection.style.display = 'block';

    // Re-trigger animations
    document.querySelectorAll('.result-card').forEach(card => {
      card.style.animation = 'none';
      card.offsetHeight; // Force reflow
      card.style.animation = '';
    });

  } catch (err) {
    loadingSection.style.display = 'none';
    showError(err.message);
  } finally {
    fetchBtn.disabled = false;
  }
});

// ── Enter key to submit ──────────────────────
skInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') fetchBtn.click();
});
