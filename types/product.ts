export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // Stored in whole naira
  compareAtPrice?: number | null; // Stored in whole naira
  images: string[];
  categoryId: string;
  categoryName?: string;
  categorySlug?: string;
  stockStatus: StockStatus;
  isBestSeller: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  searchTags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  images: string[];
  categoryId: string;
  stockStatus: StockStatus;
  isBestSeller: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  searchTags: string[];
}
