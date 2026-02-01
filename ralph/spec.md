# Spec — Caférico

## What we're building
Caférico (caferico.be) — Belgische specialty coffee webshop. Next.js 15 headless frontend met WooCommerce backend.

## Current State
- Redesign compleet (42/42 stories)
- Mollie checkout integratie compleet
- WooCommerce REST API integratie werkt
- Cart client-side (localStorage) via CartProvider/CartDrawer
- Checkout flow: cart → adresformulier → Mollie redirect → return pagina

## What's Next
<!-- Define the next feature/phase here before starting agents -->
<!-- Example: Auth phase — NextAuth.js met magic links + Google OAuth -->

## Acceptance Criteria
<!-- When is the next feature DONE? -->

## Out of Scope
<!-- What we're NOT building in this run -->

## Technical Constraints
- Next.js 15 (App Router, TypeScript)
- Tailwind CSS only
- next-intl (NL, EN, FR, ES)
- WooCommerce REST API (headless, one.com)
- Mollie checkout (niet Stripe)
- NextAuth.js voor auth
- Vercel deployment
