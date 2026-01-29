'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const faqKeys = ['one', 'two', 'three', 'four'] as const;

export default function SubscriptionFaq() {
  const t = useTranslations('Subscriptions');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {faqKeys.map((key, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={key}
            className="rounded-2xl border border-cream/10 bg-surface-darker transition-colors hover:border-cream/20"
          >
            <button
              onClick={() => toggle(index)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              aria-expanded={isOpen}
            >
              <h3 className="font-serif text-lg text-cream">
                {t(`faq.items.${key}.question`)}
              </h3>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cream/20 text-cream/60 transition-transform duration-300 ${isOpen ? 'rotate-45 border-gold/40 text-gold' : ''}`}
                aria-hidden="true"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-5 text-sm leading-relaxed text-cream/70">
                  {t(`faq.items.${key}.answer`)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
