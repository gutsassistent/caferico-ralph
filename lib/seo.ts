import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { locales, defaultLocale } from '@/lib/i18n';

const SITE_URL = 'https://caferico.be';
const OG_IMAGE = `${SITE_URL}/images/DSCF3617.jpg`;

type SeoOptions = {
  locale: string;
  page: string;
  path?: string;
  ogImage?: string;
  titleValues?: Record<string, string>;
  descriptionValues?: Record<string, string>;
};

export async function generatePageMetadata({
  locale,
  page,
  path = '',
  ogImage,
  titleValues,
  descriptionValues,
}: SeoOptions): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Seo' });

  const title = t(`${page}.title`, titleValues);
  const description = t(`${page}.description`, descriptionValues);
  const fullTitle = `${title} | Café RICO`;
  const canonicalPath = path ? `/${path}` : '';
  const canonical = `${SITE_URL}/${locale}${canonicalPath}`;
  const image = ogImage || OG_IMAGE;

  const alternates: Record<string, string> = {};
  for (const loc of locales) {
    alternates[loc === 'nl' ? 'nl-BE' : loc === 'fr' ? 'fr-BE' : loc] =
      `${SITE_URL}/${loc}${canonicalPath}`;
  }

  return {
    title: fullTitle,
    description,
    keywords: t('keywords'),
    alternates: {
      canonical,
      languages: {
        ...alternates,
        'x-default': `${SITE_URL}/${defaultLocale}${canonicalPath}`,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: 'Café RICO',
      locale: locale === 'nl' ? 'nl_BE' : locale === 'fr' ? 'fr_BE' : locale,
      type: 'website',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
  };
}
