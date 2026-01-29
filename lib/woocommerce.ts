import type { WooCommerceProduct, WooCommerceCategory } from '@/types/woocommerce';

const BASE_URL = process.env.WOOCOMMERCE_URL;
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

// Only request the fields we actually use
const PRODUCT_FIELDS = [
  'id', 'name', 'slug', 'type', 'status', 'featured',
  'description', 'short_description', 'sku',
  'price', 'regular_price', 'sale_price', 'on_sale',
  'stock_status', 'categories', 'images', 'attributes',
  'variations', 'related_ids', 'tags',
].join(',');

const CATEGORY_FIELDS = 'id,name,slug,parent,description,count,image';

// Use globalThis so cache survives Next.js dev hot reloads
const globalWithCache = globalThis as typeof globalThis & {
  __wcCache?: Map<string, { data: unknown; ts: number }>;
};
if (!globalWithCache.__wcCache) {
  globalWithCache.__wcCache = new Map();
}
const memCache = globalWithCache.__wcCache;
const CACHE_TTL = 3600 * 1000; // 1 hour

function getCached<T>(key: string): T | undefined {
  const entry = memCache.get(key);
  if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data as T;
  if (entry) memCache.delete(key);
  return undefined;
}

function setCache(key: string, data: unknown) {
  memCache.set(key, { data, ts: Date.now() });
}

async function wcFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  if (!BASE_URL || !CONSUMER_KEY || !CONSUMER_SECRET) {
    throw new Error('WooCommerce environment variables not configured');
  }

  const url = new URL(`/wp-json/wc/v3/${endpoint}`, BASE_URL);
  url.searchParams.set('consumer_key', CONSUMER_KEY);
  url.searchParams.set('consumer_secret', CONSUMER_SECRET);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < 4; attempt++) {
    if (attempt > 0) {
      await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)));
    }

    const res = await fetch(url.toString(), { cache: 'no-store' });

    if (res.status === 429) {
      lastError = new Error('WooCommerce API error: 429 Too Many Requests');
      continue;
    }

    if (!res.ok) {
      throw new Error(`WooCommerce API error: ${res.status} ${res.statusText}`);
    }

    return res.json() as Promise<T>;
  }

  throw lastError!;
}

async function fetchAllProducts(params: Record<string, string> = {}): Promise<WooCommerceProduct[]> {
  const allProducts: WooCommerceProduct[] = [];
  let page = 1;
  const perPage = params.per_page || '100';

  while (true) {
    const products = await wcFetch<WooCommerceProduct[]>('products', {
      _fields: PRODUCT_FIELDS,
      per_page: perPage,
      page: String(page),
      status: 'publish',
      ...params,
    });

    allProducts.push(...products);

    if (products.length < Number(perPage)) break;
    page++;
  }

  return allProducts;
}

export async function getProducts(params: Record<string, string> = {}): Promise<WooCommerceProduct[]> {
  const cacheKey = `products:${JSON.stringify(params)}`;
  const cached = getCached<WooCommerceProduct[]>(cacheKey);
  if (cached) return cached;

  const data = await fetchAllProducts(params);
  setCache(cacheKey, data);
  return data;
}

export async function getProduct(slug: string): Promise<WooCommerceProduct | null> {
  const cacheKey = `product:${slug}`;
  const cached = getCached<WooCommerceProduct | null>(cacheKey);
  if (cached !== undefined) return cached;

  const products = await wcFetch<WooCommerceProduct[]>('products', {
    slug,
    _fields: PRODUCT_FIELDS,
  });
  const product = products[0] ?? null;
  setCache(cacheKey, product);
  return product;
}

export async function getProductsByIds(ids: number[]): Promise<WooCommerceProduct[]> {
  if (ids.length === 0) return [];

  const cacheKey = `products-ids:${ids.sort().join(',')}`;
  const cached = getCached<WooCommerceProduct[]>(cacheKey);
  if (cached) return cached;

  const data = await wcFetch<WooCommerceProduct[]>('products', {
    include: ids.join(','),
    per_page: String(ids.length),
    _fields: PRODUCT_FIELDS,
  });
  setCache(cacheKey, data);
  return data;
}

export async function getProductCategories(): Promise<WooCommerceCategory[]> {
  const cacheKey = 'categories';
  const cached = getCached<WooCommerceCategory[]>(cacheKey);
  if (cached) return cached;

  const data = await wcFetch<WooCommerceCategory[]>('products/categories', {
    per_page: '100',
    hide_empty: 'true',
    _fields: CATEGORY_FIELDS,
  });
  setCache(cacheKey, data);
  return data;
}

export async function searchProducts(query: string): Promise<WooCommerceProduct[]> {
  return fetchAllProducts({ search: query });
}
