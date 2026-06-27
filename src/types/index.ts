export type CategorySlug = string;

export type Category = {
  slug: CategorySlug;
  name: string;
  description: string;
  image: string;
  href: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: CategorySlug;
  price: number;
  salePrice?: number;
  image: string;
  images: string[];
  shortDescription: string;
  description: string;
  tags: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  isOffer?: boolean;
  isFeatured?: boolean;
  badge?: string;
  stock?: number;
  inventoryTracking?: boolean;
};

export type CartItem = { slug: string; quantity: number; product?: Product };

export type PaymentMethod = "cod" | "bkash" | "nagad";
export type PaymentStatus = "unpaid" | "pending" | "verified" | "failed" | "refunded";
export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
export type MessageStatus = "new" | "read" | "replied" | "archived";

export type OrderInputItem = {
  slug: string;
  quantity: number;
};

export type CreateOrderInput = {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  deliveryArea: string;
  customerNote?: string;
  paymentMethod: PaymentMethod;
  paymentTransactionId?: string;
  items: OrderInputItem[];
};

export type CreateOrderResponse = {
  orderNumber: string;
  total: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
};

export type TrackingInput = {
  orderNumber: string;
  phone: string;
};

export type TrackingItem = {
  productName: string;
  productSlug: string;
  productImageUrl?: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type TrackingResponse = {
  orderNumber: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  items: TrackingItem[];
};

export type ContactInput = {
  name: string;
  phone?: string;
  email?: string;
  subject?: string;
  message: string;
};

export type ApiErrorResponse = {
  error: string;
  code?: "BACKEND_NOT_CONFIGURED" | "VALIDATION_ERROR" | "NOT_FOUND" | "SERVER_ERROR";
};

export type AdminOrderListItem = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  hasPaymentTransactionId: boolean;
  createdAt: string;
};

export type AdminOrderItem = {
  productName: string;
  productSlug: string;
  productImageUrl?: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type AdminOrderDetail = AdminOrderListItem & {
  customerAddress: string;
  deliveryArea: string;
  customerNote?: string;
  paymentNumber?: string;
  paymentTransactionId?: string;
  subtotal: number;
  deliveryCharge: number;
  items: AdminOrderItem[];
};

export type AdminMessage = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  subject?: string;
  message: string;
  status: MessageStatus;
  createdAt: string;
};

export type DashboardStats = {
  totalOrders: number;
  pendingOrders: number;
  activeOrders: number;
  deliveredOrders: number;
  unpaidPayments: number;
  totalRevenue: number;
  newMessages: number;
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  totalCategories: number;
};

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminProductListItem = {
  id: string;
  name: string;
  slug: string;
  sku?: string;
  categoryId?: string;
  categoryName?: string;
  categorySlug?: string;
  price: number;
  compareAtPrice?: number;
  imageUrl?: string;
  stock: number;
  lowStockThreshold: number;
  inventoryTracking: boolean;
  isActive: boolean;
  isBestSeller: boolean;
  isNew: boolean;
  isOffer: boolean;
  isFeatured: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type AdminProductDetail = AdminProductListItem & {
  shortDescription?: string;
  description?: string;
  galleryUrls: string[];
  sortOrder: number;
};

export type ProductFormInput = {
  name: string;
  slug: string;
  sku?: string;
  categoryId: string;
  shortDescription?: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  imageUrl?: string;
  galleryUrls: string[];
  stock: number;
  lowStockThreshold: number;
  sortOrder: number;
  tags: string[];
  isActive: boolean;
  isBestSeller: boolean;
  isNew: boolean;
  isOffer: boolean;
  isFeatured: boolean;
  inventoryTracking: boolean;
};

export type CategoryFormInput = {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
};

export type UploadResponse = {
  url: string;
  path: string;
};
