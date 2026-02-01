/**
 * Runtime validation of required environment variables.
 * Call validateEnv() at application startup (e.g. in instrumentation.ts or layout).
 * Server-side only — do not import in client components.
 */

interface EnvVar {
  name: string;
  required: boolean;
  hint: string;
}

const SERVER_ENV_VARS: EnvVar[] = [
  {
    name: 'MOLLIE_API_KEY',
    required: true,
    hint: 'Get your API key from https://my.mollie.com/dashboard/developers/api-keys',
  },
  {
    name: 'WOOCOMMERCE_URL',
    required: true,
    hint: 'Base URL of your WooCommerce installation (e.g. https://caferico.be)',
  },
  {
    name: 'WOOCOMMERCE_CONSUMER_KEY',
    required: true,
    hint: 'Generate in WooCommerce → Settings → Advanced → REST API',
  },
  {
    name: 'WOOCOMMERCE_CONSUMER_SECRET',
    required: true,
    hint: 'Generate in WooCommerce → Settings → Advanced → REST API',
  },
  {
    name: 'MOLLIE_WEBHOOK_TOKEN',
    required: true,
    hint: 'Shared secret for webhook URL verification. Generate with: openssl rand -hex 32',
  },
  {
    name: 'NEXT_PUBLIC_BASE_URL',
    required: false,
    hint: 'Public URL for Mollie redirects/webhooks. Defaults to http://localhost:3000',
  },
  {
    name: 'DATABASE_URL',
    required: true,
    hint: 'PostgreSQL connection string (e.g. postgres://user:pass@host:5432/caferico_auth)',
  },
  {
    name: 'AUTH_SECRET',
    required: true,
    hint: 'Generate with: npx auth secret',
  },
  {
    name: 'GOOGLE_CLIENT_ID',
    required: false,
    hint: 'Google OAuth client ID from https://console.cloud.google.com/apis/credentials',
  },
  {
    name: 'GOOGLE_CLIENT_SECRET',
    required: false,
    hint: 'Google OAuth client secret from https://console.cloud.google.com/apis/credentials',
  },
  {
    name: 'RESEND_API_KEY',
    required: false,
    hint: 'Resend API key for magic link emails from https://resend.com/api-keys',
  },
  {
    name: 'AUTH_EMAIL_FROM',
    required: false,
    hint: 'Sender address for magic link emails (e.g. Café RICO <noreply@caferico.be>)',
  },
];

export function validateEnv(): void {
  const missing: string[] = [];

  for (const v of SERVER_ENV_VARS) {
    if (v.required && !process.env[v.name]) {
      missing.push(`  - ${v.name}: ${v.hint}`);
    }
  }

  if (missing.length > 0) {
    console.error(
      `\n❌ Missing required environment variables:\n${missing.join('\n')}\n\n` +
      `Copy .env.example to .env.local and fill in the values.\n`
    );
  }
}
