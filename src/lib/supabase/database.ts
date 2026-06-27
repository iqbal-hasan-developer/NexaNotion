import type { MessageStatus, PaymentMethod, PaymentStatus, OrderStatus } from "@/types";

export type SupabaseCategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
};

export type SupabaseProductRow = {
  id: string;
  category_id: string | null;
  sku: string | null;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  image_url: string | null;
  gallery_urls: string[] | null;
  stock: number | null;
  low_stock_threshold: number | null;
  sort_order: number | null;
  is_featured: boolean | null;
  inventory_tracking: boolean | null;
  is_active: boolean | null;
  is_best_seller: boolean | null;
  is_new: boolean | null;
  is_offer: boolean | null;
  tags: string[] | null;
  created_at: string | null;
  updated_at: string | null;
};

type SupabaseCategoryInsert = {
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  sort_order?: number | null;
  is_active?: boolean | null;
};

type SupabaseProductInsert = {
  category_id?: string | null;
  sku?: string | null;
  name: string;
  slug: string;
  short_description?: string | null;
  description?: string | null;
  price: number;
  compare_at_price?: number | null;
  image_url?: string | null;
  gallery_urls?: string[] | null;
  stock?: number | null;
  low_stock_threshold?: number | null;
  sort_order?: number | null;
  is_featured?: boolean | null;
  inventory_tracking?: boolean | null;
  is_active?: boolean | null;
  is_best_seller?: boolean | null;
  is_new?: boolean | null;
  is_offer?: boolean | null;
  tags?: string[] | null;
};

export type SupabaseOrderRow = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  delivery_area: string;
  customer_note: string | null;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_transaction_id: string | null;
  payment_number: string | null;
  order_status: OrderStatus;
  subtotal: number;
  delivery_charge: number;
  total: number;
  created_at: string | null;
  updated_at: string | null;
};

export type SupabaseOrderItemRow = {
  id: string;
  order_id: string | null;
  product_id: string | null;
  product_name: string;
  product_slug: string;
  product_image_url: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
  created_at: string | null;
};

type SupabaseOrderInsert = Omit<SupabaseOrderRow, "id" | "created_at" | "updated_at" | "payment_status" | "order_status"> & {
  payment_status?: PaymentStatus;
  order_status?: OrderStatus;
};

type SupabaseOrderItemInsert = Omit<SupabaseOrderItemRow, "id" | "created_at">;

export type SupabaseContactMessageInsert = {
  name: string;
  phone?: string | null;
  email?: string | null;
  subject?: string | null;
  message: string;
  status?: MessageStatus;
};

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: SupabaseCategoryRow;
        Insert: SupabaseCategoryInsert;
        Update: Partial<SupabaseCategoryInsert>;
        Relationships: [];
      };
      products: {
        Row: SupabaseProductRow;
        Insert: SupabaseProductInsert;
        Update: Partial<SupabaseProductInsert>;
        Relationships: [];
      };
      orders: {
        Row: SupabaseOrderRow;
        Insert: SupabaseOrderInsert;
        Update: Partial<SupabaseOrderInsert>;
        Relationships: [];
      };
      order_items: {
        Row: SupabaseOrderItemRow;
        Insert: SupabaseOrderItemInsert;
        Update: Partial<SupabaseOrderItemInsert>;
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          phone: string | null;
          email: string | null;
          subject: string | null;
          message: string;
          status: MessageStatus | null;
          created_at: string | null;
        };
        Insert: SupabaseContactMessageInsert;
        Update: Partial<SupabaseContactMessageInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      decrement_product_stock: {
        Args: { product_id: string; requested_quantity: number };
        Returns: boolean;
      };
    };
  };
};
