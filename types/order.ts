export type OrderStatus = 'pending' | 'contacted' | 'fulfilled' | 'abandoned';

export interface OrderItemSnapshot {
  productId: string;
  slug: string;
  name: string;
  price: number; // Snapshot of whole naira price at time of order
  quantity: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  customerName: string;
  phoneNumber: string;
  deliveryAddress: string;
  notes?: string | null;
  promoCode?: string | null;
  items: OrderItemSnapshot[];
  totalAmount: number; // Stored in whole naira
  status: OrderStatus;
  createdAt: string;
}

export interface CheckoutFormData {
  customerName: string;
  phoneNumber: string;
  deliveryAddress: string;
  notes?: string;
  promoCode?: string;
}

export interface CartItem {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number | null;
    images: string[];
    stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  };
  quantity: number;
}
