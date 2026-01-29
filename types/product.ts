export type ProductCollection = 'beans' | 'ground' | 'accessories';

export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  collection: ProductCollection;
  origin: string;
  notes: string;
};

export function isAccessory(collection: string): boolean {
  return collection === 'accessories';
}

export function isCoffee(collection: string): boolean {
  return collection === 'beans' || collection === 'ground';
}
