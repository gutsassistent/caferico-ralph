import type { WooCommerceProduct } from '@/types/woocommerce';

export type ProductCollection = 'beans' | 'ground' | 'accessories';

export type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  regular_price: number;
  sale_price: number | null;
  on_sale: boolean;
  description: string;
  short_description: string;
  collection: string;
  origin: string;
  notes: string;
  images: { id: number; src: string; name: string; alt: string; thumbnail?: string }[];
  categories: { id: number; name: string; slug: string }[];
  attributes: WooCommerceProduct['attributes'];
  variations: number[];
  related_ids: number[];
  stock_status: string;
  featured: boolean;
};

export function mapWooProduct(wc: WooCommerceProduct): Product {
  const categorySlug = wc.categories[0]?.slug ?? '';
  const collection = resolveCollection(categorySlug);

  const getAttr = (name: string) =>
    wc.attributes.find((a) => a.name.toLowerCase() === name.toLowerCase())?.options[0] ?? '';

  return {
    id: wc.id,
    name: wc.name,
    slug: wc.slug,
    price: parseFloat(wc.price) || 0,
    regular_price: parseFloat(wc.regular_price) || 0,
    sale_price: wc.sale_price ? parseFloat(wc.sale_price) : null,
    on_sale: wc.on_sale,
    description: wc.description,
    short_description: wc.short_description,
    collection,
    origin: getAttr('origin') || getAttr('oorsprong') || '',
    notes: getAttr('notes') || getAttr('smaaknotities') || wc.short_description.replace(/<[^>]*>/g, ''),
    images: wc.images,
    categories: wc.categories,
    attributes: wc.attributes,
    variations: wc.variations,
    related_ids: wc.related_ids,
    stock_status: wc.stock_status,
    featured: wc.featured,
  };
}

function resolveCollection(slug: string): string {
  const map: Record<string, string> = {
    koffiebonen: 'beans',
    bonen: 'beans',
    beans: 'beans',
    gemalen: 'ground',
    ground: 'ground',
    accessoires: 'accessories',
    accessories: 'accessories',
  };
  return map[slug] ?? slug;
}

export function isAccessory(collection: string): boolean {
  return collection === 'accessories';
}

export function isCoffee(collection: string): boolean {
  return collection === 'beans' || collection === 'ground';
}
