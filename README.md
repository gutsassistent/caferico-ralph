# Caférico

Premium Belgian specialty coffee — headless e-commerce front-end.

## Stack

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS** with custom premium theme
- **next-intl** — NL (default), EN, FR, ES
- **WooCommerce REST API** (headless backend)
- **Mollie** (hosted checkout, redirect)
- **Auth.js v5** (magic links via Resend + Google OAuth)
- **Client-side cart** with localStorage persistence

## Getting Started

```bash
npm install
cp .env.example .env.local  # Fill in your values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.example` to `.env.local` and configure all required variables. The app validates these at startup and logs errors for any missing required values.

| Variable | Required | Description |
|----------|----------|-------------|
| `MOLLIE_API_KEY` | Yes | Mollie API key (`test_xxx` or `live_xxx`) |
| `WOOCOMMERCE_URL` | Yes | WooCommerce base URL |
| `WOOCOMMERCE_CONSUMER_KEY` | Yes | WooCommerce REST API consumer key |
| `WOOCOMMERCE_CONSUMER_SECRET` | Yes | WooCommerce REST API consumer secret |
| `NEXT_PUBLIC_BASE_URL` | No | Public URL for redirects/webhooks (default: `http://localhost:3000`) |
| `AUTH_SECRET` | Yes | Auth.js session secret (generate with `npx auth secret`) |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret |
| `RESEND_API_KEY` | No | Resend API key for magic link emails |
| `AUTH_EMAIL_FROM` | No | Sender address for magic link emails |

## Auth Setup

### Auth.js (NextAuth v5)

Authentication uses [Auth.js v5](https://authjs.dev/) with JWT sessions. Two login methods are available:

1. **Magic link** (via [Resend](https://resend.com/)) — passwordless email login
2. **Google OAuth** — sign in with Google

Generate an `AUTH_SECRET`:

```bash
npx auth secret
```

### Google OAuth

1. Go to [Google Cloud Console > Credentials](https://console.cloud.google.com/apis/credentials)
2. Create an **OAuth 2.0 Client ID** (Web application)
3. Add authorized redirect URI: `https://caferico.be/api/auth/callback/google` (and `http://localhost:3000/api/auth/callback/google` for dev)
4. Copy the Client ID and Client Secret to `.env.local`

### Resend (Magic Links)

1. Create an account at [resend.com](https://resend.com/)
2. Add and verify your domain (`caferico.be`) in the Resend dashboard
3. Create an API key and set `RESEND_API_KEY` in `.env.local`
4. Set `AUTH_EMAIL_FROM` to your verified sender address (e.g. `Café RICO <noreply@caferico.be>`)

### Auth Flow

1. User clicks login → redirected to `/login`
2. User chooses magic link (email) or Google OAuth
3. On first login, a WooCommerce customer record is looked up or created by email
4. JWT session stores user info + WooCommerce customer ID
5. Authenticated users can access `/account` (profile + order history)
6. Checkout form pre-fills address data for logged-in users

## Mollie Setup

1. Create an account at [mollie.com](https://www.mollie.com/)
2. Go to **Developers > API keys** in the [Mollie Dashboard](https://my.mollie.com/dashboard/developers/api-keys)
3. Copy your **test API key** (`test_xxx`) to `MOLLIE_API_KEY` in `.env.local`
4. For local webhook testing, use a tunnel like [ngrok](https://ngrok.com/) and set `NEXT_PUBLIC_BASE_URL` to the tunnel URL
5. Enable desired payment methods in the Mollie Dashboard (Bancontact, iDEAL, credit card, etc.)

### Checkout Flow

1. Customer fills in address on `/checkout`
2. Form submits to `POST /api/checkout` which creates a Mollie payment
3. Customer is redirected to Mollie hosted checkout
4. After payment, customer returns to `/checkout/return?id=tr_xxx`
5. Mollie sends webhook to `POST /api/webhook/mollie` which creates the WooCommerce order

### Going Live

- Replace `test_xxx` key with `live_xxx` key in production environment
- Set `NEXT_PUBLIC_BASE_URL` to `https://caferico.be`
- Ensure webhook URL is publicly accessible

## Project Structure

```
app/[locale]/          → Pages (shop, subscriptions, blog, about, contact, faq, checkout, login, account)
app/api/               → API routes (checkout, webhook, auth, account)
components/            → Reusable UI components
data/                  → Mock product/blog/FAQ data (JSON)
messages/              → i18n translation files per locale
i18n/                  → next-intl routing and config
lib/                   → Utilities, Mollie client, WooCommerce helpers, shipping
types/                 → TypeScript type definitions
```

## Design

Elegant, warm, premium. Dark backgrounds with deep browns, cream, and gold accents. Playfair Display serif headings, Inter sans-serif body.
