const BASE_URL = process.env.WOOCOMMERCE_URL;
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

export async function wcFetch<T>(
  endpoint: string,
  params: Record<string, string> = {},
  init?: RequestInit
): Promise<T> {
  if (!BASE_URL || !CONSUMER_KEY || !CONSUMER_SECRET) {
    throw new Error('WooCommerce environment variables not configured');
  }

  const url = new URL(`/wp-json/wc/v3/${endpoint}`, BASE_URL);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const authHeader =
    'Basic ' + Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < 4; attempt++) {
    if (attempt > 0) {
      await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)));
    }

    const res = await fetch(url.toString(), {
      cache: 'no-store',
      ...init,
      headers: {
        Authorization: authHeader,
        ...init?.headers,
      },
    });

    if (res.status === 429) {
      lastError = new Error('WooCommerce API error: 429 Too Many Requests');
      continue;
    }

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`WooCommerce API error: ${res.status} ${res.statusText} ${body}`);
    }

    return res.json() as Promise<T>;
  }

  throw lastError!;
}
