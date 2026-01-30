import createMiddleware from 'next-intl/middleware';
import { defaultLocale, locales } from './lib/i18n';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});

const protectedPatterns = ['/account'];

function isProtectedRoute(pathname: string): boolean {
  const pathWithoutLocale = pathname.replace(/^\/(nl|en|fr|es)/, '') || '/';
  return protectedPatterns.some((pattern) => pathWithoutLocale.startsWith(pattern));
}

export default async function middleware(req: NextRequest) {
  if (isProtectedRoute(req.nextUrl.pathname)) {
    // Behind reverse proxy (Traefik/Coolify), internal requests arrive as HTTP
    // but cookies are set with __Secure- prefix. Force secureCookie detection.
    const secureCookie =
      req.nextUrl.protocol === 'https:' ||
      process.env.AUTH_URL?.startsWith('https://') ||
      req.headers.get('x-forwarded-proto') === 'https';

    const token = await getToken({ req, secret: process.env.AUTH_SECRET, secureCookie });
    if (!token) {
      const loginUrl = new URL(`/${defaultLocale}/login`, req.url);
      loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
