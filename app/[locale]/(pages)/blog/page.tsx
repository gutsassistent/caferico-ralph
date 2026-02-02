import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import Container from '@/components/Container';
import ParallaxOrb from '@/components/ParallaxOrb';
import Reveal from '@/components/Reveal';
import blogPosts from '@/data/blog-posts.json';
import { generatePageMetadata } from '@/lib/seo';
import { breadcrumbSchema, jsonLd } from '@/lib/structured-data';

type BlogPost = (typeof blogPosts)[number];

const POSTS = (blogPosts as BlogPost[]).sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({ locale, page: 'blog', path: 'blog' });
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('Blog');

  const localeMap: Record<string, string> = { nl: 'nl-NL', en: 'en-US', fr: 'fr-FR', es: 'es-ES' };
  const intlLocale = localeMap[locale] ?? 'nl-NL';

  const dateFormatter = new Intl.DateTimeFormat(intlLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const blogBreadcrumb = breadcrumbSchema([
    { name: 'Home', url: `https://caferico.be/${locale}` },
    { name: 'Blog', url: `https://caferico.be/${locale}/blog` },
  ]);

  return (
    <main className="min-h-screen bg-noir text-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(blogBreadcrumb) }}
      />
      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-cream/10">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(26,15,10,0.95),rgba(60,21,24,0.9),rgba(26,15,10,0.98))]" />
        <div className="pointer-events-none absolute inset-0 bg-coffee-grain opacity-35" />
        <ParallaxOrb
          className="pointer-events-none absolute -right-24 top-12 h-64 w-64 rounded-full bg-gold/20 blur-3xl"
          speed={0.06}
        />
        <ParallaxOrb
          className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-roast/45 blur-3xl"
          speed={0.1}
        />

        <Container className="relative py-20 lg:py-28">
          <div className="max-w-2xl space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-gold/70">{t('hero.eyebrow')}</p>
            <h1 className="font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
              {t('hero.title')}
            </h1>
            <p className="text-sm text-cream/70 sm:text-base lg:text-lg">{t('hero.description')}</p>
          </div>
        </Container>
      </section>

      {/* Blog grid */}
      <section className="section-light py-16 sm:py-24">
        <Container className="space-y-12">
          <Reveal>
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-gold/70">
                {t('listing.eyebrow')}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl">{t('listing.title')}</h2>
              <p className="max-w-xl text-sm text-inkMuted sm:text-base">
                {t('listing.description')}
              </p>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
            {POSTS.map((post, index) => (
              <Reveal key={post.id} delay={index * 80} className="h-full">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-ink/10 bg-white/60 transition duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)]"
                >
                  {/* Image placeholder */}
                  <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl bg-gradient-to-br from-espresso via-surface-mid to-noir">
                    <div className="absolute inset-0 bg-coffee-grain opacity-40" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,165,116,0.25),_transparent_60%)]" />
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="pill-roastery uppercase tracking-[0.3em]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-inkMuted">
                      {dateFormatter.format(new Date(post.date))}
                      <span className="mx-2 text-ink/30">&middot;</span>
                      {post.readTime} {t('listing.readTime')}
                    </p>
                    <h3 className="mt-3 font-serif text-lg leading-snug text-ink transition-colors duration-300 group-hover:text-gold">
                      {post.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-inkMuted">{post.excerpt}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold transition group-hover:text-ink">
                      {t('listing.readMore')}
                      <span aria-hidden="true">&rarr;</span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          {/* Mock Pagination */}
          <Reveal>
            <nav aria-label={t('listing.paginationLabel')} className="flex items-center justify-center gap-2 pt-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-gold/50 bg-gold/10 text-sm font-medium text-gold">
                1
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink/10 text-sm text-ink/40 cursor-not-allowed">
                2
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink/10 text-sm text-ink/40 cursor-not-allowed">
                3
              </span>
              <span className="ml-2 flex h-10 items-center justify-center rounded-lg border border-ink/10 px-4 text-sm text-ink/40 cursor-not-allowed">
                {t('listing.nextPage')}
                <span aria-hidden="true" className="ml-1">&rarr;</span>
              </span>
            </nav>
          </Reveal>
        </Container>
      </section>
    </main>
  );
}
