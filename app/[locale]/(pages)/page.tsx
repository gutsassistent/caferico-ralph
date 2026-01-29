import { getTranslations } from 'next-intl/server';

export default async function HomePage() {
  const t = await getTranslations('Home');

  return (
    <main className="min-h-screen bg-noir text-cream">
      <section className="relative overflow-hidden px-6 py-24 sm:px-12 lg:px-20">
        <div className="pointer-events-none absolute inset-0 bg-coffee-glow" />
        <div className="pointer-events-none absolute inset-0 bg-coffee-grain opacity-40" />
        <div className="relative mx-auto flex max-w-4xl flex-col gap-6 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-gold/80">
            {t('eyebrow')}
          </p>
          <h1 className="text-4xl font-serif leading-tight sm:text-5xl lg:text-6xl">
            {t('title')}
          </h1>
          <p className="text-base text-cream/80 sm:text-lg">
            {t('description')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="rounded-full border border-gold/60 px-6 py-3 text-sm uppercase tracking-[0.2em] text-gold transition hover:bg-gold hover:text-noir">
              {t('ctaPrimary')}
            </button>
            <button className="rounded-full border border-cream/30 px-6 py-3 text-sm uppercase tracking-[0.2em] text-cream/80 transition hover:border-cream/60 hover:text-cream">
              {t('ctaSecondary')}
            </button>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-5xl gap-6 px-6 pb-16 sm:grid-cols-3 sm:px-12 lg:px-20">
        {['craft', 'origin', 'ritual'].map((key) => (
          <div
            key={key}
            className="rounded-2xl border border-cream/10 bg-[#1f130d] p-6 text-left shadow-[0_0_40px_rgba(0,0,0,0.35)]"
          >
            <h2 className="text-lg font-serif text-cream">{t(`${key}.title`)}</h2>
            <p className="mt-2 text-sm text-cream/70">{t(`${key}.description`)}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
