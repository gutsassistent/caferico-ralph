const SITE_URL = 'https://caferico.be';
const LOGO_URL = 'https://www.caferico.be/wp-content/uploads/2024/10/logo-caferico.png';

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Café RICO',
    url: SITE_URL,
    logo: LOGO_URL,
    description: 'Biologische specialty coffee uit Honduras — fair trade, direct van de koffieboer.',
    foundingDate: '2018',
    sameAs: [
      'https://www.facebook.com/cafericocoffee',
      'https://www.instagram.com/caferico.be',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+32474964090',
      email: 'info@caferico.be',
      contactType: 'customer service',
      availableLanguage: ['Dutch', 'English', 'French', 'Spanish'],
    },
  };
}

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#localbusiness`,
    name: 'Café RICO',
    url: SITE_URL,
    logo: LOGO_URL,
    image: 'https://www.caferico.be/wp-content/uploads/2025/05/DSCF3617.jpg',
    telephone: '+32474964090',
    email: 'info@caferico.be',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Beekstraat 138',
      addressLocality: 'Erpe-Mere',
      postalCode: '9420',
      addressCountry: 'BE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 50.9333,
      longitude: 3.9500,
    },
    priceRange: '€€',
    sameAs: [
      'https://www.facebook.com/cafericocoffee',
      'https://www.instagram.com/caferico.be',
    ],
  };
}

type BreadcrumbItem = { name: string; url: string };

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

type ProductSchemaOptions = {
  name: string;
  description: string;
  image: string;
  price: number;
  slug: string;
  locale: string;
  sku?: string;
};

export function productSchema({
  name,
  description,
  image,
  price,
  slug,
  locale,
  sku,
}: ProductSchemaOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    sku: sku || slug,
    brand: {
      '@type': 'Brand',
      name: 'Café RICO',
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/${locale}/shop/${slug}`,
      priceCurrency: 'EUR',
      price: price.toFixed(2),
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Café RICO',
      },
    },
  };
}

export function jsonLd(data: Record<string, unknown> | Record<string, unknown>[]) {
  return JSON.stringify(data);
}
