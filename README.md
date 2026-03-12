# 🔍 Stripe Account Inspector

A sleek, modern web app to **securely inspect your Stripe account details** — including balance, recent charges, payouts, and more — using your Stripe API keys.

> 🌐 **Live:** [stripe.devorahub.com](https://stripe.devorahub.com)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🏢 **Account Info** | View account ID, business name, email, country, currency, and enabled capabilities |
| 💰 **Live Balance** | See available and pending balances across all currencies |
| 📊 **Quick Stats** | Active products, customers, recent charges & payouts at a glance |
| 💳 **Recent Charges** | Last 5 transactions with amount, status, description, and date |
| 🏦 **Recent Payouts** | Last 5 payouts with amount, status, method, and arrival date |
| 📄 **Raw JSON** | Expandable raw account data from Stripe API |
| 🔒 **Secure** | Keys are sent directly to Stripe — nothing is stored or logged |
| 🎨 **Premium UI** | Dark glassmorphism design with smooth animations |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- A Stripe account with API keys ([Dashboard → Developers → API Keys](https://dashboard.stripe.com/apikeys))

### Local Development

```bash
# Clone the repository
git clone https://github.com/tech-devorahub/stripe.devorahub.com.git
cd stripe.devorahub.com

# Install dependencies
npm install

# Start the development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Usage

1. Open the app in your browser
2. Enter your **Secret Key** (`sk_live_...` or `sk_test_...`) — *required*
3. Optionally enter your **Publishable Key** (`pk_live_...`) to auto-detect live/test mode
4. Click **"Inspect Account"**
5. View your account details, balance, and recent activity

> ⚠️ **Security Note:** Your API keys are sent directly to Stripe's servers through the backend API route. They are **never stored, logged, or shared** with any third party.

---

## 📂 Project Structure

```
stripe.devorahub.com/
├── api/
│   ├── account.js          # Serverless function — fetches Stripe account data
│   └── validate-pk.js      # Serverless function — validates publishable key format
├── public/
│   ├── index.html           # Main HTML page
│   ├── style.css            # Premium dark-mode styles
│   └── app.js               # Client-side JavaScript
├── server.js                # Express server for local development
├── vercel.json              # Vercel deployment configuration
├── package.json
└── README.md
```

---

## 🌍 Deployment

This project is designed for **one-click deployment on Vercel**.

### Deploy to Vercel

1. Push the repo to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Vercel auto-detects the configuration from `vercel.json`
4. Add your custom domain (e.g., `stripe.devorahub.com`) in Vercel → Settings → Domains

No environment variables are required — all Stripe keys are provided at runtime by the user.

---

## 🛠️ Tech Stack

- **Frontend:** Vanilla HTML, CSS, JavaScript
- **Backend:** Node.js serverless functions (Vercel)
- **API:** [Stripe Node.js SDK](https://github.com/stripe/stripe-node)
- **Hosting:** [Vercel](https://vercel.com)
- **Font:** [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts

---

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/account` | Fetches full account details, balance, charges, payouts, products & customer counts |
| `POST` | `/api/validate-pk` | Validates publishable key format and detects live/test mode |

### Request Example

```bash
curl -X POST https://stripe.devorahub.com/api/account \
  -H "Content-Type: application/json" \
  -d '{"secretKey": "sk_test_..."}'
```

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  Built with 💜 by <a href="https://github.com/tech-devorahub">DevoraHub</a>
</p>
