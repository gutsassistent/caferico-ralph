import createMiddleware from 'next-intl/middleware';
import { auth } from '@/lib/auth';
import { defaultLocale, locales } from './lib/i18n';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});

const protectedPatterns = ['/account'];

function isProtectedRoute(pathname: string): boolean {
  // Strip locale prefix if present
  const pathWithoutLocale = pathname.replace(/^\/(nl|en|fr|es)/, '') || '/';
  return protectedPatterns.some((pattern) => pathWithoutLocale.startsWith(pattern));
}

export default auth((req: NextRequest) => {
  const session = (req as unknown as { auth: unknown }).auth;

  if (isProtectedRoute(req.nextUrl.pathname) && !session) {
    const loginUrl = new URL(`/${defaultLocale}/login`, req.url);
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
