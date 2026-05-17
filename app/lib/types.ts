export interface Address {
  address?: string;
  city?: string;
  postalCode?: string;
  phone?: string;
}

export interface AppUser {
  id?: string;
  _id?: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: Omit<Address, "phone">;
  profilePicture?: string;
  role?: string;
  isBlocked?: boolean;
  createdAt?: string;
  [key: string]: unknown;
}

export interface ProductVariant {
  id?: string;
  _id?: string;
  vKey?: string;
  flavor: string;
  emoji?: string;
  stock: number;
  availability?: boolean;
  variantImage?: string[];
  nicotine?: string;
  [key: string]: unknown;
}

export interface Product {
  id?: string;
  _id?: string;
  key: string;
  slug?: string | null;
  name: string;
  tagline?: string;
  description?: string;
  basePrice: number;
  deliveryFee?: number;
  category: string;
  productImage?: string[];
  variants?: ProductVariant[];
  variantCount?: number;
  hasStock?: boolean;
  sale?: string;
  [key: string]: unknown;
}

export interface CartItem {
  cartId: string;
  key: string;
  vKey?: string;
  productId?: string;
  name: string;
  flavor?: string;
  emoji?: string;
  price: number;
  delivery?: number;
  image?: string;
  quantity: number;
  [key: string]: unknown;
}
