# Spec — Caférico

## What we're building
Caférico (caferico.be) — Belgische specialty coffee webshop. Next.js 15 headless frontend met WooCommerce backend.

## Current State
- Redesign compleet
- Mollie checkout integratie compleet
- WooCommerce REST API integratie werkt
- Cart client-side (localStorage) via CartProvider/CartDrawer
- Checkout flow: cart → adresformulier → Mollie redirect → return pagina

## What's Next
<!-- Define the next feature/phase here before starting agents -->

Oké, hier is precies wat er gedaan moet worden:

1. Shop filters aansluiten

Het probleem zit in components/ShopCatalog.tsx. Er zijn drie filter-states die niks doen:

• selectedTypes (mild, intens, espresso, decaf)
• selectedFormats (250g, 500g)
• selectedForms (beans, ground)
Ze worden wel bijgehouden in state maar nooit meegenomen in filteredProducts. De useMemo op regel ~140 filtert alleen op collection en query.

Fix: In de filteredProducts useMemo, na de collection en query filters, toevoegen:

if (selectedTypes.size > 0) {
  result = result.filter(p => selectedTypes.has(p.type)); // check welk veld op Product dit is
}
if (selectedFormats.size > 0) {
  result = result.filter(p => selectedFormats.has(p.weight));
}
if (selectedForms.size > 0) {
  result = result.filter(p => selectedForms.has(p.form));
}

En selectedTypes, selectedFormats, selectedForms toevoegen aan de dependency array van de useMemo.

Check wel even het Product type (types/product.ts) — de veldnamen moeten matchen. Mogelijk zijn type, weight, form er nog niet en moeten die uit WooCommerce attributes gehaald worden.


2. Contact form → Resend

In components/ContactForm.tsx op regel ~95 staat:

console.log('Contact form submitted:', values);
await new Promise((resolve) => setTimeout(resolve, 1200));

Wat nodig is:

1. API route aanmaken: app/api/contact/route.ts
2. Daarin Resend SDK gebruiken (zelfde package als magic links) om een email te sturen naar het Caferico contactadres
3. ContactForm aanpassen om naar /api/contact te POSTen in plaats van console.log
De API route is ~20 regels:

import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { name, email, subject, message } = await req.json();
  // validatie
  await resend.emails.send({
    from: 'Caferico <noreply@caferico.be>',  // of verified domain
    to: 'info@caferico.be',  // of whatever het contactadres is
    replyTo: email,
    subject: `Contact: ${subject}`,
    text: `Van: ${name} (${email})\n\n${message}`
  });
  return Response.json({ ok: true });
}



## Acceptance Criteria
<!-- When is the next feature DONE? -->
1. Shop filters aansluiten

Acceptance criteria:

• Type filter (mild/intens/espresso/decaf) filtert producten correct
• Formaat filter (250g/500g) filtert op gewicht
• Vorm filter (bonen/gemalen) filtert op maalgraad
• Filters combineren met AND-logica (type + formaat + vorm + collectie + zoekterm)
• Resultaatteller update live bij elke filterwijziging
• Reset knop zet alles terug


2. Contact form → Resend

Acceptance criteria:

• Formulier POST naar /api/contact
• Email komt aan bij Caferico contactadres via Resend
• Reply-to is het emailadres van de bezoeker
• Bezoeker ziet success/error feedback
• Server-side validatie (naam, email, onderwerp, bericht verplicht)
• Rate limiting: max 3 submits per IP per uur


3. Newsletter form -> Resend

Acceptance criteria:

• Formulier POST naar /api/newsletter
• Email opgeslagen via Resend Contacts API (of Audiences)
• Dubbele inschrijving wordt afgevangen (geen error, wel melding "al ingeschreven")
• Success/error feedback in de UI



## Out of Scope
<!-- What we're NOT building in this run -->


1. Shop filters aansluiten

Niet bouwen:

• Geen URL query params voor filters (geen deelbare filter-URLs)
• Geen prijsrange slider
• Geen filter op herkomst/origin
• Geen "aantal resultaten per filter optie" counters
• Geen server-side filtering — blijft client-side op de al opgehaalde producten


2. Contact form → Resend

Niet bouwen:

• Geen bevestigingsmail naar de bezoeker
• Geen HTML email template — plain text volstaat
• Geen spam filtering (honeypot, captcha)
• Geen bijlage-upload
• Geen admin dashboard voor berichten


3. Newsletter form -> Resend

Niet bouwen:

• Geen double opt-in flow
• Geen uitschrijf-mechanisme (komt later met echte campagnes)
• Geen welkomstmail
• Geen integratie met externe marketing tools
• Geen admin overzicht van subscribers


## Technical Constraints
- Next.js 15 (App Router, TypeScript)
- Tailwind CSS only
- next-intl (NL, EN, FR, ES)
- WooCommerce REST API (headless, one.com)
- Mollie checkout (niet Stripe)
- NextAuth.js voor auth
- Vercel deployment
