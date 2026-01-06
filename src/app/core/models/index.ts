export interface User {
  id: string;
  clerkId: string;
  email: string;
  username: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatarUrl?: string;
  websiteUrl?: string;
  twitterHandle?: string;
  role: 'USER' | 'CREATOR' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface Store {
  id: string;
  userId: string;
  name: string;
  slug: string;
  description?: string;
  tagline?: string;
  logoUrl?: string;
  bannerUrl?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
  user?: User;
  products?: Product[];
  _count?: {
    products: number;
  };
}

export interface Product {
  id: string;
  storeId: string;
  title: string;
  slug: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  coverImageUrl?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
  store?: Store;
  files?: ProductFile[];
}

export interface ProductFile {
  id: string;
  productId: string;
  fileId: string;
  file: FileItem;
}

export interface FileItem {
  id: string;
  userId: string;
  filename: string;
  storageKey: string;
  mimeType: string;
  size: number;
  status: 'PENDING' | 'UPLOADED' | 'FAILED' | 'DELETED';
  createdAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  status: 'PENDING' | 'PAID' | 'FULFILLED' | 'FAILED' | 'REFUNDED' | 'CANCELLED';
  totalAmount: number;
  currency: string;
  paidAt?: string;
  createdAt: string;
  items: OrderItem[];
  payment?: Payment;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  priceAtPurchase: number;
  titleSnapshot: string;
  descriptionSnapshot?: string;
  product: Product;
}

export interface Payment {
  id: string;
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'CAPTURED' | 'FAILED' | 'REFUNDED';
}

export interface License {
  id: string;
  userId: string;
  productId: string;
  orderId: string;
  licenseKey: string;
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
  maxDownloads: number;
  downloadCount: number;
  lastDownloadAt?: string;
  createdAt: string;
  product: Product;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
