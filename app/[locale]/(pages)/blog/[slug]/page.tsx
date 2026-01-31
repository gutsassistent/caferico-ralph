import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import Container from '@/components/Container';
import ParallaxOrb from '@/components/ParallaxOrb';
import Reveal from '@/components/Reveal';
import blogPosts from '@/data/blog-posts.json';
import { generatePageMetadata } from '@/lib/seo';
import { breadcrumbSchema, jsonLd } from '@/lib/structured-data';

type BlogPost = (typeof blogPosts)[number];

const POSTS = blogPosts as BlogPost[];

/* Map blog slugs to hero images from CONTEXT.md */
const HERO_IMAGES: Record<string, string> = {
  'slow-roast':
    'https://www.caferico.be/wp-content/uploads/2025/05/DSCF3617.jpg',
  'origin-stories':
    'https://www.caferico.be/wp-content/uploads/2025/05/DSCF0031-scaled.jpg',
  'brewing-rituals':
    'https://www.caferico.be/wp-content/uploads/2025/05/20180110_111420-scaled.jpg',
  'belgian-coffee-culture':
    'https://www.caferico.be/wp-content/uploads/2018/05/marcala-landschap.png',
  'water-quality':
    'https://www.caferico.be/wp-content/uploads/2018/05/droogtunnel-klein.png',
};

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) return {};
  return generatePageMetadata({
    locale,
    page: 'blogPost',
    path: `blog/${slug}`,
    titleValues: { title: post.title },
    descriptionValues: { excerpt: post.excerpt },
    ogImage: HERO_IMAGES[slug],
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const t = await getTranslations('Blog');

  const post = POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const localeMap: Record<string, string> = { nl: 'nl-NL', en: 'en-US', fr: 'fr-FR', es: 'es-ES' };
  const intlLocale = localeMap[locale] ?? 'nl-NL';

  const dateFormatter = new Intl.DateTimeFormat(intlLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const relatedPosts = POSTS.filter((p) => p.id !== post.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const heroImage = HERO_IMAGES[post.slug];

  const blogPostBreadcrumb = breadcrumbSchema([
    { name: 'Home', url: `https://caferico.be/${locale}` },
    { name: 'Blog', url: `https://caferico.be/${locale}/blog` },
    { name: post.title, url: `https://caferico.be/${locale}/blog/${post.slug}` },
  ]);

  return (
    <main className="min-h-screen bg-noir text-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(blogPostBreadcrumb) }}
      />
      {/* Breadcrumbs */}
      <section className="relative isolate overflow-hidden border-b border-cream/10">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(26,15,10,0.95),rgba(60,21,24,0.88),rgba(26,15,10,0.96))]" />
        <div className="pointer-events-none absolute inset-0 bg-coffee-grain opacity-35" />
        <ParallaxOrb
          className="pointer-events-none absolute -right-32 top-8 h-72 w-72 rounded-full bg-gold/20 blur-3xl"
          speed={0.06}
        />

        <Container className="relative py-10">
          <nav
            aria-label={t('breadcrumbs.label')}
            className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.3em] text-cream/60"
          >
            <Link href="/" className="transition hover:text-cream">
              {t('breadcrumbs.home')}
            </Link>
            <span className="text-cream/40">/</span>
            <Link href="/blog" className="transition hover:text-cream">
              {t('breadcrumbs.blog')}
            </Link>
            <span className="text-cream/40">/</span>
            <span className="text-cream/90">{post.title}</span>
          </nav>
        </Container>
      </section>

      {/* Article header + featured image */}
      <section className="py-16 sm:py-24">
        <Container className="max-w-3xl space-y-8">
          <Reveal>
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-cream/15 bg-noir px-3 py-1 text-xs uppercase tracking-[0.3em] text-gold/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-cream/60">
                <div className="flex items-center gap-3">
                  {/* Author avatar */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 bg-gradient-to-br from-espresso to-noir font-serif text-xs text-gold">
                    {post.author
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <p className="text-sm text-cream/90">{post.author}</p>
                    <p className="text-xs text-cream/50">
                      {dateFormatter.format(new Date(post.date))}
                      <span className="mx-2 text-cream/30">&middot;</span>
                      {post.readTime} {t('listing.readTime')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Featured hero image */}
          <Reveal delay={80}>
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-cream/10 shadow-[0_35px_70px_rgba(0,0,0,0.5)]">
              {heroImage ? (
                <Image
                  src={heroImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 680px"
                  priority
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-espresso via-surface-mid to-noir" />
                  <div className="absolute inset-0 bg-coffee-grain opacity-40" />
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-noir/40 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 rounded-full border border-cream/20 bg-noir/70 px-3 py-1 text-xs uppercase tracking-[0.3em] text-cream/70 backdrop-blur-sm">
                {t('detail.imageBadge')}
              </div>
            </div>
          </Reveal>

          {/* Article body — optimised reading typography */}
          <Reveal delay={160}>
            <article className="mx-auto max-w-2xl">
              <div className="space-y-7">
                {post.content.map((paragraph, index) => (
                  <p
                    key={`p-${index}`}
                    className={`text-lg leading-[1.7] ${
                      index === 0
                        ? 'text-cream/90 first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-5xl first-letter:leading-[0.8] first-letter:text-gold'
                        : 'text-cream/70'
                    }`}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Blockquote */}
              <blockquote className="my-10 border-l-2 border-gold/50 pl-6">
                <p className="font-serif text-xl italic leading-[1.6] text-cream/80 sm:text-2xl">
                  {t('detail.quote')}
                </p>
                <cite className="mt-4 block text-xs uppercase not-italic tracking-[0.3em] text-gold/60">
                  &mdash; {post.author}
                </cite>
              </blockquote>

              {/* Share buttons */}
              <div className="mt-12 border-t border-cream/10 pt-8">
                <p className="mb-4 text-xs uppercase tracking-[0.3em] text-cream/50">
                  {t('detail.share')}
                </p>
                <div className="flex gap-3">
                  {/* Facebook */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://caferico.be/blog/${post.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t('detail.shareFacebook')}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream/60 transition hover:border-gold/50 hover:text-gold"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </a>
                  {/* X / Twitter */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://caferico.be/blog/${post.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t('detail.shareTwitter')}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream/60 transition hover:border-gold/50 hover:text-gold"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  {/* LinkedIn */}
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://caferico.be/blog/${post.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t('detail.shareLinkedIn')}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream/60 transition hover:border-gold/50 hover:text-gold"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  {/* Email */}
                  <a
                    href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(`https://caferico.be/blog/${post.slug}`)}`}
                    aria-label={t('detail.shareEmail')}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream/60 transition hover:border-gold/50 hover:text-gold"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </a>
                </div>
              </div>
            </article>
          </Reveal>
        </Container>
      </section>

      {/* Related posts */}
      <Reveal>
        <section className="border-t border-cream/10 py-16 sm:py-24">
          <Container className="space-y-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl space-y-3">
                <p className="text-xs uppercase tracking-[0.4em] text-gold/70">
                  {t('related.eyebrow')}
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl">{t('related.title')}</h2>
                <p className="text-sm text-cream/70 sm:text-base">{t('related.description')}</p>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold transition hover:text-cream"
              >
                {t('related.cta')}
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
              {relatedPosts.map((related, index) => (
                <Reveal key={related.id} delay={index * 80} className="h-full">
                  <Link
                    href={`/blog/${related.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-cream/10 bg-surface-darker p-4 transition duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_30px_60px_rgba(0,0,0,0.4)]"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                      {HERO_IMAGES[related.slug] ? (
                        <Image
                          src={HERO_IMAGES[related.slug]}
                          alt={related.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-br from-espresso via-surface-mid to-noir" />
                          <div className="absolute inset-0 bg-coffee-grain opacity-40" />
                        </>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-noir/50 via-transparent to-transparent" />
                    </div>
                    <div className="mt-4 flex-1">
                      <p className="text-xs uppercase tracking-[0.3em] text-cream/50">
                        {dateFormatter.format(new Date(related.date))}
                        <span className="mx-2 text-cream/30">&middot;</span>
                        {related.readTime} {t('listing.readTime')}
                      </p>
                      <h3 className="mt-2 font-serif text-lg text-cream transition-colors duration-300 group-hover:text-gold">
                        {related.title}
                      </h3>
                      <p className="mt-2 text-sm text-cream/60">{related.excerpt}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      </Reveal>
    </main>
  );
}
