export type GrindOption = 'beans' | 'fine' | 'coarse';
export type WeightOption = '250' | '500' | '1000';

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  collection: string;
  grind: GrindOption;
  weight: WeightOption;
  quantity: number;
};

export type CartItemInput = Omit<CartItem, 'quantity'> & { quantity?: number };
