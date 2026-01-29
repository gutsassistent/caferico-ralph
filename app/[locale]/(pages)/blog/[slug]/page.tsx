import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Container from '@/components/Container';
import ParallaxOrb from '@/components/ParallaxOrb';
import Reveal from '@/components/Reveal';
import blogPosts from '@/data/blog-posts.json';

type BlogPost = (typeof blogPosts)[number];

const POSTS = blogPosts as BlogPost[];

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({
  params
}: {
  params: { locale: string; slug: string };
}) {
  const t = await getTranslations('Blog');
  const { locale, slug } = params;

  const post = POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const relatedPosts = POSTS.filter((p) => p.id !== post.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-noir text-cream">
      {/* Hero */}
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
            <Link href={`/${locale}`} className="transition hover:text-cream">
              {t('breadcrumbs.home')}
            </Link>
            <span className="text-cream/40">/</span>
            <Link
              href={`/${locale}/blog`}
              className="transition hover:text-cream"
            >
              {t('breadcrumbs.blog')}
            </Link>
            <span className="text-cream/40">/</span>
            <span className="text-cream/90">{post.title}</span>
          </nav>
        </Container>
      </section>

      {/* Article header */}
      <section className="py-16 lg:py-20">
        <Container className="max-w-3xl space-y-8">
          <Reveal>
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-cream/15 bg-[#1a0f0a] px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-gold/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl font-serif leading-tight sm:text-4xl lg:text-5xl">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-cream/60">
                <div className="flex items-center gap-3">
                  {/* Author avatar placeholder */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 bg-gradient-to-br from-espresso to-noir text-xs font-serif text-gold">
                    {post.author
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <p className="text-sm text-cream/90">{post.author}</p>
                    <p className="text-xs text-cream/50">
                      {dateFormatter.format(new Date(post.date))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Featured image placeholder */}
          <Reveal delay={80}>
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-cream/10 bg-gradient-to-br from-espresso via-[#1f130d] to-noir shadow-[0_35px_70px_rgba(0,0,0,0.5)]">
              <div className="absolute inset-0 bg-coffee-grain opacity-40" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,165,116,0.35),_transparent_60%)]" />
              <div className="absolute bottom-5 left-5 rounded-full border border-cream/20 bg-noir/70 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-cream/70">
                {t('detail.imageBadge')}
              </div>
            </div>
          </Reveal>

          {/* Article body */}
          <Reveal delay={160}>
            <article className="space-y-6">
              {post.content.map((paragraph, index) => (
                <p
                  key={`p-${index}`}
                  className={`text-base leading-relaxed sm:text-lg ${
                    index === 0
                      ? 'text-cream/90 first-letter:float-left first-letter:mr-2 first-letter:text-5xl first-letter:font-serif first-letter:leading-[0.8] first-letter:text-gold'
                      : 'text-cream/70'
                  }`}
                >
                  {paragraph}
                </p>
              ))}

              {/* Blockquote */}
              <blockquote className="my-8 border-l-2 border-gold/50 pl-6">
                <p className="text-lg font-serif italic text-cream/80 sm:text-xl">
                  {t('detail.quote')}
                </p>
                <cite className="mt-3 block text-xs uppercase tracking-[0.3em] text-gold/60 not-italic">
                  &mdash; {post.author}
                </cite>
              </blockquote>
            </article>
          </Reveal>
        </Container>
      </section>

      {/* Related posts */}
      <Reveal>
        <section className="border-t border-cream/10 py-16">
          <Container className="space-y-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl space-y-3">
                <p className="text-xs uppercase tracking-[0.4em] text-gold/70">
                  {t('related.eyebrow')}
                </p>
                <h2 className="text-3xl font-serif sm:text-4xl">
                  {t('related.title')}
                </h2>
                <p className="text-sm text-cream/70 sm:text-base">
                  {t('related.description')}
                </p>
              </div>
              <Link
                href={`/${locale}/blog`}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold transition hover:text-cream"
              >
                {t('related.cta')}
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((related, index) => (
                <Reveal key={related.id} delay={index * 80} className="h-full">
                  <Link
                    href={`/${locale}/blog/${related.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-cream/10 bg-[#140b08] p-4 transition duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_30px_60px_rgba(0,0,0,0.4)]"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-gradient-to-br from-espresso via-[#1d120d] to-noir">
                      <div className="absolute inset-0 bg-coffee-grain opacity-40" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,165,116,0.25),_transparent_60%)]" />
                    </div>
                    <div className="mt-4 flex-1">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-cream/50">
                        {dateFormatter.format(new Date(related.date))}
                      </p>
                      <h3 className="mt-2 text-lg font-serif text-cream group-hover:text-gold transition-colors duration-300">
                        {related.title}
                      </h3>
                      <p className="mt-2 text-sm text-cream/60">
                        {related.excerpt}
                      </p>
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
