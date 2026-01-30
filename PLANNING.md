# Caférico — Planningsdocument

## Huidige staat (Fase 1 - compleet)

### Wat er is
- Next.js 15 front-end met mock data
- 12 pagina's: Home, Shop, Product Detail, Subscriptions, About, Blog, Blog Detail, Contact, FAQ, 404
- Meertalig: NL (default), EN, FR, ES via next-intl
- Client-side winkelwagen (localStorage)
- Tailwind CSS met premium kleurenpalet (espresso, roast, cream, gold, noir)
- Playfair Display + Inter fonts

### Wat er niet goed werkt / ontbreekt
1. **Shop pagina toont geen producten** — product grid rendert niet zichtbaar (data is er wel)
2. **Geen echte afbeeldingen** — alles is CSS gradients als placeholder
3. **Subscription tiers niet zichtbaar** — pagina toont alleen hero + footer
4. **Alle formulieren zijn mock** — contact, newsletter doen niks
5. **Geen checkout flow** — winkelwagen heeft geen afronding
6. **Geen authenticatie** — account knop doet niks
7. **Geen echte productdata** — alles is hardcoded JSON

### Design beoordeling
- **Sterk:** Kleurenpalet is premium, typography is goed, header/footer zijn solide
- **Zwak:** Veel lege ruimte door ontbrekende afbeeldingen, sommige secties renderen niet volledig, hero secties zijn repetitief over pagina's

---

## Fase 2 — Backend & Functionaliteit

### 2A: WooCommerce REST API integratie
**Doel:** Echte productdata in plaats van mock JSON

- [ ] WooCommerce REST API credentials configureren
- [ ] Product listing ophalen (naam, prijs, beschrijving, afbeeldingen, categorieën)
- [ ] Product detail ophalen (varianten, voorraad)
- [ ] Collecties/categorieën ophalen
- [ ] Afbeeldingen via WooCommerce (eindelijk echte foto's)
- [ ] Zoek en filter op server-side data
- [ ] Cache strategie (ISR of SWR)

**Impact:** Shop en product pagina's worden functioneel met echte data.

### 2B: Checkout & Betalingen (Mollie)
**Doel:** Klanten kunnen daadwerkelijk bestellen

- [ ] Bestaand Mollie account van Caférico hergebruiken
- [ ] Mollie API keys configureren in Next.js
- [ ] Checkout flow: cart → adresgegevens → Mollie payment → bevestiging
- [ ] Mollie Payments API integratie
- [ ] Webhook voor payment status updates
- [ ] Order aanmaken in WooCommerce na succesvolle betaling
- [ ] Bevestigingsmail (via WooCommerce wp_mail)
- [ ] Betaalmethodes: Bancontact, kaarten, PayPal

**Keuze:** Mollie hosted checkout (redirect naar Mollie pagina) — simpelst en vertrouwd voor klanten.

### 2C: Subscriptions (Mollie Recurring)
**Doel:** Maandelijks koffie-abonnement

- [ ] Mollie Customers API: klant aanmaken bij eerste bestelling
- [ ] Eerste betaling met `sequenceType: "first"` voor mandaat
- [ ] Mollie Subscriptions API: recurring met interval `1 month`
- [ ] Tiers: nog te bepalen (overleg met bedrijfseigenaars)
- [ ] Klant portal voor beheer (pauzeren, annuleren, wijzigen)
- [ ] Webhooks voor subscription events
- [ ] Koppeling met WooCommerce voor order aanmaak bij elke renewal

**Open:** Subscription tiers en prijzen moeten nog bepaald worden met de eigenaars.

### 2D: Authenticatie (NextAuth.js)
**Doel:** Klanten kunnen inloggen

- [ ] NextAuth.js configureren
- [ ] Google OAuth provider
- [ ] Email/wachtwoord (credentials provider)
- [ ] Account pagina (profiel, bestellingen, abonnementen)
- [ ] Koppeling met WooCommerce Customer API
- [ ] Wachtwoord vergeten flow

### 2E: Deployment (Coolify op Hetzner)
**Doel:** Site live op caferico.be

- [ ] PostgreSQL database aanmaken in Coolify
- [ ] Next.js applicatie aanmaken in Coolify (GitHub repo koppelen)
- [ ] Environment variabelen configureren (DATABASE_URL, MOLLIE_API_KEY, WC keys, AUTH_SECRET, etc.)
- [ ] DNS caferico.be wijzigen (A-record naar Hetzner IP)
- [ ] SSL certificaat (automatisch via Coolify/Let's Encrypt)
- [ ] caferico.nl, caferico.eu, direct-trade.one redirects
- [ ] one.com hosting behouden voor solidairmethonduras.be + WooCommerce API
- [ ] Auto-deploy bij push naar main (GitHub webhook)

**Infra:** Hetzner CAX11 (ARM, 4GB RAM, Helsinki) — draait al Coolify + n8n
**Let op:** WooCommerce blijft draaien op one.com als headless backend (alleen API, geen front-end).

---

## Fase 3 — Polish & Groei

### 3A: Design overhaul
- [ ] Echte productfotografie toevoegen
- [ ] Hero afbeeldingen per pagina
- [ ] Micro-interacties en animaties verfijnen
- [ ] Mobile UX optimaliseren
- [ ] Lighthouse score > 90

### 3B: Content
- [ ] Echte Over Ons tekst
- [ ] Blog posts schrijven
- [ ] FAQ aanvullen met echte vragen
- [ ] SEO meta tags optimaliseren per pagina
- [ ] Sitemap.xml en robots.txt

### 3C: Marketing features
- [ ] Newsletter integratie (Mailchimp, Brevo, of Stripe email)
- [ ] Social media links invullen
- [ ] Google Analytics / Plausible
- [ ] Open Graph afbeeldingen per pagina

### 3D: Operationeel
- [ ] B2B portal (later, als volume groeit)
- [ ] Shopify migratie (pas bij honderden orders/dag)
- [ ] Multi-warehouse support

---

## Architectuur overzicht

```
┌──────────────────────────────────┐     ┌──────────────────┐
│   Hetzner CAX11 (Coolify)        │     │   one.com         │
│   ┌────────────────────────┐     │     │   (WooCommerce)   │
│   │ Next.js app            │─────┼────▶│   headless backend│
│   │ caferico.be            │     │     └──────────────────┘
│   └────────────────────────┘     │
│   ┌────────────────────────┐     │
│   │ PostgreSQL (auth)      │     │
│   └────────────────────────┘     │
│   ┌────────────────────────┐     │
│   │ n8n (automation)       │     │
│   └────────────────────────┘     │
└──────────────┬───────────────────┘
               │ Mollie API
               ▼
┌─────────────────┐
│   Mollie         │
│   Checkout +     │
│   Subscriptions  │
│   Bancontact     │
│   PayPal         │
└─────────────────┘
```

---

## Kosten overzicht

| Item | Huidig | Na migratie |
|------|--------|-------------|
| one.com Enthusiast | €253/jaar | €253/jaar (behouden voor WC API + solidairmethonduras) |
| Domeinen | €66/jaar | €66/jaar |
| Hetzner CAX11 (Coolify) | - | €3.98/maand (gedeeld met n8n) |
| Mollie | al actief | 1.8% + €0.25/transactie (Bancontact: €0.39) |
| **Totaal vast** | **€319/jaar** | **€319/jaar** |

Hetzner server is gedeeld met n8n. Alleen Mollie transactiekosten bij daadwerkelijke verkopen.

---

## Beslissingen (genomen)

1. **Productfoto's** → Bestaande foto's uit WordPress media library via WooCommerce API
2. **Checkout** → Mollie (bestaand account), hosted checkout (redirect)
3. **Subscriptions** → Mollie Recurring API (geen Stripe nodig)
4. **Email** → WooCommerce wp_mail voor bestellingen, Brevo (gratis tier) voor newsletter
5. **Analytics** → Google Analytics (bestaand, behouden)
6. **Blog CMS** → WordPress REST API (eigenaars kennen WordPress al)
7. **Auth** → NextAuth.js met bestaande WooCommerce accounts + Google OAuth als extra optie
8. **CI/CD** → Vercel automatisch: push = deploy. Staging via preview branches. GitHub Action voor typecheck bij PRs.
9. **Prioriteit** → 2A → 2B → 2C → 2D → 2E

## Subscription tiers (voorstel — te bespreken met eigenaars)

| Tier | Hoeveelheid | Prijs/maand | Korting vs. eenmalig |
|------|------------|-------------|---------------------|
| Proeverij | 250g | €6,50 | ~6% |
| Klassiek | 500g | €12,50 | ~9% |
| Atelier | 1kg | €22,90 | ~13% |

- Klant kiest per tier: bonen of gemalen
- Maandelijks, pauzeerbaar, annuleerbaar
- Prijzen hardcoded in Mollie (handmatig aanpasbaar bij prijswijziging)
- Eventueel later: verrassingspakket (wisselende origin)

## Open punten

1. **Subscription tiers en prijzen** → bespreken met bedrijfseigenaars (voorstel hierboven)
2. **Mollie API keys** → Jonathan moet die ophalen uit Mollie dashboard
