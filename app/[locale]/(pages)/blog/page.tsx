import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import Container from '@/components/Container';
import ParallaxOrb from '@/components/ParallaxOrb';
import Reveal from '@/components/Reveal';
import blogPosts from '@/data/blog-posts.json';

type BlogPost = (typeof blogPosts)[number];

const POSTS = (blogPosts as BlogPost[]).sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

export default async function BlogPage({
  params
}: {
  params: { locale: string };
}) {
  const t = await getTranslations('Blog');
  const { locale } = params;

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <main className="min-h-screen bg-noir text-cream">
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
            <p className="text-xs uppercase tracking-[0.4em] text-gold/70">
              {t('hero.eyebrow')}
            </p>
            <h1 className="text-4xl font-serif leading-tight sm:text-5xl lg:text-6xl">
              {t('hero.title')}
            </h1>
            <p className="text-sm text-cream/70 sm:text-base lg:text-lg">
              {t('hero.description')}
            </p>
          </div>
        </Container>
      </section>

      {/* Blog grid */}
      <section className="py-16 lg:py-24">
        <Container className="space-y-12">
          <Reveal>
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-gold/70">
                {t('listing.eyebrow')}
              </p>
              <h2 className="text-3xl font-serif sm:text-4xl">
                {t('listing.title')}
              </h2>
              <p className="max-w-xl text-sm text-cream/70 sm:text-base">
                {t('listing.description')}
              </p>
            </div>
          </Reveal>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {POSTS.map((post, index) => (
              <Reveal key={post.id} delay={index * 80} className="h-full">
                <Link
                  href={`/${locale}/blog/${post.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-cream/10 bg-[#140b08] transition duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_30px_60px_rgba(0,0,0,0.4)]"
                >
                  {/* Image placeholder */}
                  <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl bg-gradient-to-br from-espresso via-[#1d120d] to-noir">
                    <div className="absolute inset-0 bg-coffee-grain opacity-40" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,165,116,0.25),_transparent_60%)]" />
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-cream/20 bg-noir/70 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-cream/70"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-cream/50">
                      {dateFormatter.format(new Date(post.date))}
                      <span className="mx-2 text-cream/30">&middot;</span>
                      {post.author}
                    </p>
                    <h3 className="mt-3 text-lg font-serif leading-snug text-cream group-hover:text-gold transition-colors duration-300">
                      {post.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-cream/60">
                      {post.excerpt}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold transition group-hover:text-cream">
                      {t('listing.readMore')}
                      <span aria-hidden="true">&rarr;</span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
