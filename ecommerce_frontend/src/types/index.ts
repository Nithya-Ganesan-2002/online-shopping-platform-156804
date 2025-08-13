export type Product = {
  id?: string;
  _id?: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  brand?: string;
  images?: string[];
  stock?: number;
};

export type CartItem = {
  productId: string;
  quantity: number;
  product?: Product;
};

export type Cart = {
  items: CartItem[];
};

export type Order = {
  id?: string;
  _id?: string;
  total?: number;
  items?: CartItem[];
  status?: string;
  createdAt?: string;
  shippingAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
};

export type User = {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
};
