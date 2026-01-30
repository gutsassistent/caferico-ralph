import createMollieClient, { type MollieClient } from '@mollie/api-client';

let _client: MollieClient | null = null;

export default function getMollieClient(): MollieClient {
  if (_client) return _client;

  const apiKey = process.env.MOLLIE_API_KEY;
  if (!apiKey) {
    throw new Error(
      'MOLLIE_API_KEY is not set. Add it to your .env.local file. ' +
      'Get your API key from https://my.mollie.com/dashboard/developers/api-keys'
    );
  }

  _client = createMollieClient({ apiKey });
  return _client;
}
