import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import Container from '@/components/Container';
import LoginForm from '@/components/LoginForm';
import { generatePageMetadata } from '@/lib/seo';
import { breadcrumbSchema, jsonLd } from '@/lib/structured-data';
import { auth } from '@/lib/auth';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({ locale, page: 'login', path: 'login' });
}

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();

  if (session?.user) {
    redirect(`/${locale}/account`);
  }

  const t = await getTranslations('Login');

  const loginBreadcrumb = breadcrumbSchema([
    { name: 'Home', url: `https://caferico.be/${locale}` },
    { name: t('title'), url: `https://caferico.be/${locale}/login` },
  ]);

  return (
    <main className="min-h-screen bg-parchment text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(loginBreadcrumb) }}
      />
      <section className="section-light py-20 lg:py-28">
        <Container className="flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <p className="text-xs uppercase tracking-[0.4em] text-gold/70">
                {t('eyebrow')}
              </p>
              <h1 className="mt-3 text-4xl font-serif leading-tight text-ink sm:text-5xl">
                {t('title')}
              </h1>
              <p className="mt-3 text-sm text-ink/70 sm:text-base">
                {t('subtitle')}
              </p>
            </div>
            <LoginForm />
          </div>
        </Container>
      </section>
    </main>
  );
}
