# Caférico

Premium Belgian specialty coffee — headless e-commerce front-end.

## Stack

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS** with custom premium theme
- **next-intl** — NL (default), EN, FR, ES
- **Client-side cart** with localStorage persistence

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/[locale]/          → Pages (shop, subscriptions, blog, about, contact, faq)
components/            → Reusable UI components
data/                  → Mock product/blog/FAQ data (JSON)
messages/              → i18n translation files per locale
i18n/                  → next-intl routing and config
lib/                   → Utilities, navigation config
types/                 → TypeScript type definitions
```

## Design

Elegant, warm, premium. Dark backgrounds with deep browns, cream, and gold accents. Playfair Display serif headings, Inter sans-serif body.

## Roadmap (Fase 2)

- [ ] Shopify Storefront API integration
- [ ] Stripe subscriptions + checkout (Bancontact, PayPal)
- [ ] NextAuth.js (Google OAuth + email/password)
- [ ] Vercel deployment
