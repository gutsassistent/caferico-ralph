import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Resend from 'next-auth/providers/resend';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/lib/db';
import { users, accounts, verificationTokens } from '@/lib/schema';
import { getOrCreateCustomer } from '@/lib/woocommerce-customers';

function magicLinkHtml({ url }: { url: string }) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#1a0f0a;font-family:'Inter',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a0f0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background-color:#2c2419;border-radius:12px;padding:40px;">
        <tr><td align="center" style="padding-bottom:24px;">
          <h1 style="color:#C9A962;font-size:28px;font-family:'Playfair Display',Georgia,serif;margin:0;">Café RICO</h1>
        </td></tr>
        <tr><td align="center" style="padding-bottom:16px;">
          <p style="color:#f2e8cf;font-size:18px;margin:0;">Log in bij je account</p>
        </td></tr>
        <tr><td align="center" style="padding-bottom:24px;">
          <p style="color:#f2e8cfaa;font-size:14px;margin:0;line-height:1.6;">Klik op de knop hieronder om veilig in te loggen. De link is 24 uur geldig.</p>
        </td></tr>
        <tr><td align="center" style="padding-bottom:32px;">
          <a href="${url}" style="display:inline-block;background-color:#C9A962;color:#1a0f0a;text-decoration:none;font-weight:600;font-size:16px;padding:14px 32px;border-radius:8px;">
            Inloggen
          </a>
        </td></tr>
        <tr><td align="center">
          <p style="color:#f2e8cf66;font-size:12px;margin:0;line-height:1.5;">
            Heb je dit niet aangevraagd? Je kunt deze email veilig negeren.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function magicLinkText({ url }: { url: string }) {
  return `Log in bij Café RICO\n\nKlik op deze link om in te loggen:\n${url}\n\nDe link is 24 uur geldig.\nHeb je dit niet aangevraagd? Je kunt deze email veilig negeren.`;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    verificationTokensTable: verificationTokens,
  }),
  session: {
    strategy: 'jwt',
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.AUTH_EMAIL_FROM ?? 'Café RICO <noreply@caferico.be>',
      sendVerificationRequest: async ({ identifier: email, url, provider }) => {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${provider.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: provider.from,
            to: email,
            subject: 'Inloggen bij Café RICO',
            html: magicLinkHtml({ url }),
            text: magicLinkText({ url }),
          }),
        });
        if (!res.ok) {
          throw new Error('Resend error: ' + JSON.stringify(await res.json()));
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      // On initial sign-in, look up or create WooCommerce customer
      if (trigger === 'signIn' && user?.email) {
        try {
          const customer = await getOrCreateCustomer(user.email, user.name ?? undefined);
          token.wcCustomerId = customer.id;
        } catch (error) {
          console.error('Failed to get/create WooCommerce customer:', error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      if (token.wcCustomerId) {
        session.wcCustomerId = token.wcCustomerId as number;
      }
      return session;
    },
  },
});
