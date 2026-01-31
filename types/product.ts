import type { WooCommerceProduct } from '@/types/woocommerce';

export type ProductCollection = 'beans' | 'ground' | 'accessories';

export type GroupedChild = {
  id: number;
  name: string;
  slug: string;
  price: number;
  regular_price: number;
  images: { id: number; src: string; name: string; alt: string; thumbnail?: string }[];
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  type: 'simple' | 'grouped' | 'variable' | 'external';
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
  grouped_products: number[];
  grouped_children: GroupedChild[];
  related_ids: number[];
  stock_status: string;
  featured: boolean;
};

/**
 * Strip Divi/Elementor shortcodes, sconnect injected divs, and &nbsp; junk
 * from WooCommerce HTML content.
 */
function sanitizeHtml(html: string): string {
  if (!html) return '';

  let clean = html;
  // Remove Divi/WPBakery shortcodes: [et_pb_*], [/et_pb_*], etc.
  clean = clean.replace(/\[(?:\/)?et_pb_[^\]]*\]/g, '');
  clean = clean.replace(/\[(?:\/)?et_[^\]]*\]/g, '');
  // Remove any remaining shortcodes like [shortcode attr="val"]
  clean = clean.replace(/\[[^\]]{3,}\]/g, '');
  // Remove sconnect-is-installed injected divs
  clean = clean.replace(/<div[^>]*id="sconnect-is-installed"[^>]*>[\s\S]*?<\/div>/gi, '');
  // Collapse multiple &nbsp; and trim
  clean = clean.replace(/(&nbsp;\s*)+/g, ' ');
  // Remove empty <p> tags
  clean = clean.replace(/<p>\s*<\/p>/g, '');
  // If nothing meaningful remains, return empty
  const textOnly = clean.replace(/<[^>]*>/g, '').trim();
  if (!textOnly) return '';

  return clean.trim();
}

/** Strip HTML tags and return plain text */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export function mapWooProduct(wc: WooCommerceProduct): Product {
  const categorySlug = wc.categories[0]?.slug ?? '';
  const collection = resolveCollection(categorySlug);

  const getAttr = (name: string) =>
    wc.attributes.find((a) => a.name.toLowerCase() === name.toLowerCase())?.options[0] ?? '';

  const cleanDescription = sanitizeHtml(wc.description);
  const cleanShortDescription = sanitizeHtml(wc.short_description);

  return {
    id: wc.id,
    name: wc.name,
    slug: wc.slug,
    type: wc.type as Product['type'],
    price: parseFloat(wc.price) || 0,
    regular_price: parseFloat(wc.regular_price) || 0,
    sale_price: wc.sale_price ? parseFloat(wc.sale_price) : null,
    on_sale: wc.on_sale,
    description: cleanDescription,
    short_description: cleanShortDescription,
    collection,
    origin: getAttr('origin') || getAttr('oorsprong') || '',
    notes: getAttr('notes') || getAttr('smaaknotities') || stripHtml(cleanShortDescription),
    images: wc.images,
    categories: wc.categories,
    attributes: wc.attributes,
    variations: wc.variations,
    grouped_products: wc.grouped_products ?? [],
    grouped_children: [], // populated later by the page
    related_ids: wc.related_ids,
    stock_status: wc.stock_status,
    featured: wc.featured
  };
}

export function resolveCollection(slug: string): string {
  const map: Record<string, string> = {
    koffiebonen: 'coffee',
    bonen: 'coffee',
    beans: 'coffee',
    koffie: 'coffee',
    gemalen: 'coffee',
    ground: 'coffee',
    accessoires: 'accessories',
    accessories: 'accessories',
    zoet: 'sweets',
    geschenken: 'gifts',
    koffiemachines: 'machines',
    'hervulbare-tonnetjes': 'refillable'
  };
  return map[slug] ?? slug;
}

/** Product is coffee (beans, ground, capsules, pads) */
export function isCoffee(collection: string): boolean {
  return collection === 'coffee';
}

/** Product is NOT coffee — hide coffee-specific UI (proefprofiel, grind, weight) */
export function isNonCoffee(collection: string): boolean {
  return !isCoffee(collection);
}
