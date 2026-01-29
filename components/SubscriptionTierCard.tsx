'use client';

import { useTranslations } from 'next-intl';
import { useToast } from '@/components/Toast';
import Reveal from '@/components/Reveal';

type SubscriptionTierCardProps = {
  groupId: 'beans' | 'ground';
  tier: {
    key: string;
    price: number;
    featured: boolean;
  };
  index: number;
  priceFormatted: string;
};

export default function SubscriptionTierCard({
  groupId,
  tier,
  index,
  priceFormatted
}: SubscriptionTierCardProps) {
  const t = useTranslations('Subscriptions');
  const toastT = useTranslations('Toast');
  const { showToast } = useToast();

  const benefitKeys = ['one', 'two', 'three'] as const;

  const handleSelectPlan = () => {
    showToast(toastT('subscriptionComingSoon'), 'info');
  };

  const cardClassName = `group relative flex h-full flex-col overflow-hidden rounded-3xl border transition duration-300 ${
    tier.featured
      ? 'border-gold/60 bg-[linear-gradient(135deg,rgba(60,21,24,0.95),rgba(26,15,10,0.92))] shadow-[0_35px_70px_rgba(0,0,0,0.5)]'
      : 'border-cream/10 bg-[#140b08] hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_25px_60px_rgba(0,0,0,0.35)]'
  }`;

  return (
    <Reveal delay={index * 120} className="h-full">
      <div className={cardClassName}>
        <div className="pointer-events-none absolute inset-0 bg-coffee-grain opacity-30" />
        {tier.featured ? (
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold/20 blur-2xl" />
        ) : null}
        <div className="relative flex h-full flex-col gap-6 p-6">
          {tier.featured ? (
            <span className="inline-flex items-center self-start rounded-full border border-gold/50 bg-gold/10 px-4 py-1 text-[10px] uppercase tracking-[0.3em] text-gold">
              {t(`tiers.${groupId}.${tier.key}.badge`)}
            </span>
          ) : null}
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cream/60">
              {t(`tiers.${groupId}.${tier.key}.size`)}
            </p>
            <h4 className="mt-3 font-serif text-2xl text-cream">
              {t(`tiers.${groupId}.${tier.key}.title`)}
            </h4>
            <p className="mt-2 text-sm text-cream/70">
              {t(`tiers.${groupId}.${tier.key}.description`)}
            </p>
          </div>
          <div className="mt-auto space-y-4">
            <p className="font-serif text-3xl text-cream">
              {t('tiers.priceLabel', { price: priceFormatted })}
            </p>
            <ul className="space-y-2 text-sm text-cream/70">
              {benefitKeys.map((benefitKey) => (
                <li key={benefitKey} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-gold/70" aria-hidden="true" />
                  <span>{t(`tiers.${groupId}.${tier.key}.benefits.${benefitKey}`)}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={handleSelectPlan}
              className={`w-full rounded-full border px-5 py-3 text-xs uppercase tracking-[0.3em] transition ${
                tier.featured
                  ? 'border-gold/60 bg-gold/20 text-gold hover:bg-gold hover:text-noir'
                  : 'border-cream/20 text-cream/80 hover:border-gold/60 hover:text-gold'
              }`}
            >
              {t('tiers.cta')}
            </button>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
