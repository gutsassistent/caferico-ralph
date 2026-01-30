import createMollieClient from '@mollie/api-client';

if (!process.env.MOLLIE_API_KEY) {
  throw new Error(
    'MOLLIE_API_KEY is not set. Add it to your .env.local file. ' +
    'Get your API key from https://my.mollie.com/dashboard/developers/api-keys'
  );
}

const mollieClient = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY,
});

export default mollieClient;
