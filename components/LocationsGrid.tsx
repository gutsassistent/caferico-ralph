'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Reveal from '@/components/Reveal';

const locationKeys = [
  'cafeRico',
  'ricoLab',
  'ohneGent',
  'ohneZwalm',
  'ohneNevele',
  'ohneTernat',
  'ohneMerelbeke',
  'bakkerijFrancois',
  'boerBas',
  'akkerEnAmbacht',
] as const;

const regionKeys = [
  'oostVlaanderen',
  'antwerpen',
  'westVlaanderen',
  'vlaamsBrabant',
] as const;

/* Map location keys to their region for filtering */
const locationRegions: Record<string, string> = {
  cafeRico: 'oostVlaanderen',
  ricoLab: 'antwerpen',
  ohneGent: 'oostVlaanderen',
  ohneZwalm: 'oostVlaanderen',
  ohneNevele: 'oostVlaanderen',
  ohneTernat: 'vlaamsBrabant',
  ohneMerelbeke: 'oostVlaanderen',
  bakkerijFrancois: 'oostVlaanderen',
  boerBas: 'westVlaanderen',
  akkerEnAmbacht: 'oostVlaanderen',
};

/* Icon per type */
const typeIcons: Record<string, React.ReactNode> = {
  'Hoofdkantoor & Atelier': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
      <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
    </svg>
  ),
  'Koffiebar': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
      <path d="M17 8h1a4 4 0 0 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8ZM6 2v3M10 2v3M14 2v3" />
    </svg>
  ),
  default: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
};

function getIcon(type: string) {
  return typeIcons[type] ?? typeIcons.default;
}

export default function LocationsGrid() {
  const t = useTranslations('Locations');
  const [activeRegion, setActiveRegion] = useState<string>('all');

  const filtered = activeRegion === 'all'
    ? locationKeys
    : locationKeys.filter((k) => locationRegions[k] === activeRegion);

  return (
    <>
      {/* Region filter */}
      <div className="mb-10 flex flex-wrap gap-3">
        <button
          onClick={() => setActiveRegion('all')}
          className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
            activeRegion === 'all'
              ? 'bg-gold text-noir'
              : 'border border-ink/20 text-inkMuted hover:border-gold/40 hover:text-ink'
          }`}
        >
          {t('filter.all')}
        </button>
        {regionKeys.map((r) => (
          <button
            key={r}
            onClick={() => setActiveRegion(r)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              activeRegion === r
                ? 'bg-gold text-noir'
                : 'border border-ink/20 text-inkMuted hover:border-gold/40 hover:text-ink'
            }`}
          >
            {t(`filter.${r}`)}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
        {filtered.map((key, index) => {
          const name = t(`locations.${key}.name`);
          const type = t(`locations.${key}.type`);
          const address = t(`locations.${key}.address`);
          const description = t(`locations.${key}.description`);

          return (
            <Reveal key={key} delay={index * 80}>
              <article className="group flex h-full flex-col rounded-2xl border border-ink/10 bg-white/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-lg hover:shadow-ink/5">
                {/* Icon + type */}
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-gold">
                    {getIcon(type)}
                  </div>
                  <span className="text-xs font-medium uppercase tracking-wider text-gold/70">
                    {type}
                  </span>
                </div>

                {/* Name */}
                <h3 className="mb-1 font-serif text-xl text-ink">{name}</h3>

                {/* Address */}
                <p className="mb-3 flex items-center gap-1.5 text-sm text-inkMuted">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 shrink-0">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                  {address}
                </p>

                {/* Description */}
                <p className="mt-auto text-sm leading-relaxed text-inkMuted">
                  {description}
                </p>
              </article>
            </Reveal>
          );
        })}
      </div>

      {/* CTA */}
      <Reveal>
        <div className="mt-20 rounded-2xl border border-ink/10 bg-white/60 p-8 text-center sm:p-12">
          <h2 className="mb-3 font-serif text-2xl text-ink sm:text-3xl">
            {t('cta.title')}
          </h2>
          <p className="mx-auto mb-6 max-w-lg text-inkMuted">
            {t('cta.description')}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3 font-medium text-noir transition-colors hover:bg-gold/90"
          >
            {t('cta.button')}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </Reveal>
    </>
  );
}
