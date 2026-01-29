export type WooCommerceImage = {
  id: number;
  src: string;
  name: string;
  alt: string;
  thumbnail?: string;
};

export type WooCommerceCategory = {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  count: number;
  image: WooCommerceImage | null;
};

export type WooCommerceAttribute = {
  id: number;
  name: string;
  slug: string;
  position: number;
  visible: boolean;
  variation: boolean;
  options: string[];
};

export type WooCommerceProduct = {
  id: number;
  name: string;
  slug: string;
  type: string;
  status: string;
  featured: boolean;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: string;
  categories: { id: number; name: string; slug: string }[];
  images: WooCommerceImage[];
  attributes: WooCommerceAttribute[];
  variations: number[];
  related_ids: number[];
  tags: { id: number; name: string; slug: string }[];
  meta_data: { id: number; key: string; value: string }[];
};
