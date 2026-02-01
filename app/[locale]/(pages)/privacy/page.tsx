import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Container from '@/components/Container';
import { generatePageMetadata } from '@/lib/seo';
import { breadcrumbSchema, jsonLd } from '@/lib/structured-data';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({ locale, page: 'privacy', path: 'privacy' });
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('Privacy');

  const crumbs = breadcrumbSchema([
    { name: 'Home', url: `https://caferico.be/${locale}` },
    { name: t('title'), url: `https://caferico.be/${locale}/privacy` },
  ]);

  return (
    <main className="min-h-screen bg-noir text-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(crumbs) }}
      />
      <section className="py-20">
        <Container>
          <h1 className="mb-6 text-4xl font-serif sm:text-5xl">{t('title')}</h1>
          <p className="text-sm text-cream/70 sm:text-base">{t('description')}</p>
          <div className="mt-8 max-w-3xl space-y-4 text-sm leading-relaxed text-cream/80">
            <p>{t('content')}</p>
          </div>
        </Container>
      </section>
    </main>
  );
}
