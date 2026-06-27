import "server-only";

import { isMessageStatus, isOrderStatus, isPaymentStatus } from "@/lib/admin/statuses";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type {
  AdminMessage,
  AdminCategory,
  AdminOrderDetail,
  AdminOrderItem,
  AdminOrderListItem,
  AdminProductDetail,
  AdminProductListItem,
  CategoryFormInput,
  DashboardStats,
  MessageStatus,
  OrderStatus,
  PaymentStatus,
  ProductFormInput,
} from "@/types";

function toOrderListItem(order: {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  total: number;
  payment_method: AdminOrderListItem["paymentMethod"];
  payment_status: PaymentStatus;
  payment_transaction_id?: string | null;
  order_status: OrderStatus;
  created_at: string | null;
}): AdminOrderListItem {
  return {
    id: order.id,
    orderNumber: order.order_number,
    customerName: order.customer_name,
    customerPhone: order.customer_phone,
    total: Number(order.total),
    paymentMethod: order.payment_method,
    paymentStatus: order.payment_status,
    orderStatus: order.order_status,
    hasPaymentTransactionId: Boolean(order.payment_transaction_id),
    createdAt: order.created_at ?? new Date().toISOString(),
  };
}

function toAdminMessage(message: {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  subject: string | null;
  message: string;
  status: MessageStatus | null;
  created_at: string | null;
}): AdminMessage {
  return {
    id: message.id,
    name: message.name,
    phone: message.phone ?? undefined,
    email: message.email ?? undefined,
    subject: message.subject ?? undefined,
    message: message.message,
    status: message.status ?? "new",
    createdAt: message.created_at ?? new Date().toISOString(),
  };
}

function cleanSearch(value: string | undefined) {
  return value?.trim().replace(/[,%()]/g, " ").replace(/\s+/g, " ").slice(0, 80);
}

function toAdminCategory(category: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}): AdminCategory {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description ?? undefined,
    imageUrl: category.image_url ?? undefined,
    sortOrder: category.sort_order ?? 0,
    isActive: category.is_active ?? true,
    createdAt: category.created_at ?? new Date().toISOString(),
    updatedAt: category.updated_at ?? category.created_at ?? new Date().toISOString(),
  };
}

function toAdminProduct(product: {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  category_id: string | null;
  categories: { name: string; slug: string } | null;
  price: number;
  compare_at_price: number | null;
  image_url: string | null;
  stock: number | null;
  low_stock_threshold: number | null;
  inventory_tracking: boolean | null;
  is_active: boolean | null;
  is_best_seller: boolean | null;
  is_new: boolean | null;
  is_offer: boolean | null;
  is_featured: boolean | null;
  tags: string[] | null;
  created_at: string | null;
  updated_at: string | null;
}): AdminProductListItem {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku ?? undefined,
    categoryId: product.category_id ?? undefined,
    categoryName: product.categories?.name,
    categorySlug: product.categories?.slug,
    price: Number(product.price),
    compareAtPrice: product.compare_at_price === null ? undefined : Number(product.compare_at_price),
    imageUrl: product.image_url ?? undefined,
    stock: product.stock ?? 0,
    lowStockThreshold: product.low_stock_threshold ?? 5,
    inventoryTracking: product.inventory_tracking ?? true,
    isActive: product.is_active ?? true,
    isBestSeller: product.is_best_seller ?? false,
    isNew: product.is_new ?? false,
    isOffer: product.is_offer ?? false,
    isFeatured: product.is_featured ?? false,
    tags: product.tags ?? [],
    createdAt: product.created_at ?? new Date().toISOString(),
    updatedAt: product.updated_at ?? product.created_at ?? new Date().toISOString(),
  };
}

export async function getDashboardData(): Promise<{
  stats: DashboardStats;
  recentOrders: AdminOrderListItem[];
  recentMessages: AdminMessage[];
}> {
  const supabase = createSupabaseAdminClient();
  const [ordersResult, messagesResult, productsResult, categoriesResult] = await Promise.all([
    supabase
      .from("orders")
      .select("id,order_number,customer_name,customer_phone,total,payment_method,payment_status,payment_transaction_id,order_status,created_at")
      .order("created_at", { ascending: false }),
    supabase.from("contact_messages").select("id,name,phone,email,subject,message,status,created_at").order("created_at", { ascending: false }),
    supabase
      .from("products")
      .select("id,name,slug,sku,category_id,categories(name,slug),price,compare_at_price,image_url,stock,low_stock_threshold,inventory_tracking,is_active,is_best_seller,is_new,is_offer,is_featured,tags,created_at,updated_at")
      .order("created_at", { ascending: false }),
    supabase.from("categories").select("id,name,slug,description,image_url,sort_order,is_active,created_at,updated_at"),
  ]);

  if (ordersResult.error || messagesResult.error || productsResult.error || categoriesResult.error) {
    throw new Error("Unable to load admin dashboard.");
  }

  const orders = ordersResult.data.map(toOrderListItem);
  const messages = messagesResult.data.map(toAdminMessage);
  const products = productsResult.data.map((product) => toAdminProduct(product as unknown as Parameters<typeof toAdminProduct>[0]));
  const categories = categoriesResult.data.map(toAdminCategory);
  const stats: DashboardStats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter((order) => order.orderStatus === "pending").length,
    activeOrders: orders.filter((order) => ["confirmed", "processing"].includes(order.orderStatus)).length,
    deliveredOrders: orders.filter((order) => order.orderStatus === "delivered").length,
    unpaidPayments: orders.filter((order) => order.paymentStatus === "unpaid").length,
    totalRevenue: orders.filter((order) => order.orderStatus !== "cancelled").reduce((sum, order) => sum + order.total, 0),
    newMessages: messages.filter((message) => message.status === "new").length,
    totalProducts: products.length,
    activeProducts: products.filter((product) => product.isActive).length,
    lowStockProducts: products.filter((product) => product.inventoryTracking && product.stock <= product.lowStockThreshold).length,
    totalCategories: categories.length,
  };

  return {
    stats,
    recentOrders: orders.slice(0, 6),
    recentMessages: messages.slice(0, 6),
  };
}

export async function getAdminCategories(filters: { search?: string } = {}): Promise<AdminCategory[]> {
  const supabase = createSupabaseAdminClient();
  let query = supabase.from("categories").select("id,name,slug,description,image_url,sort_order,is_active,created_at,updated_at").order("sort_order", { ascending: true });
  const search = cleanSearch(filters.search);
  if (search) query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%`);
  const { data, error } = await query;
  if (error) throw new Error("Unable to load categories.");
  return data.map(toAdminCategory);
}

export async function getAdminCategory(slug: string): Promise<AdminCategory | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("categories").select("id,name,slug,description,image_url,sort_order,is_active,created_at,updated_at").eq("slug", slug).maybeSingle();
  if (error) throw new Error("Unable to load category.");
  return data ? toAdminCategory(data) : null;
}

export async function saveAdminCategory(input: CategoryFormInput, existingId?: string) {
  const supabase = createSupabaseAdminClient();
  const duplicate = await supabase.from("categories").select("id").eq("slug", input.slug).maybeSingle();
  if (duplicate.error) throw new Error("Could not validate category slug.");
  if (duplicate.data && duplicate.data.id !== existingId) throw new Error("This category slug is already used.");
  const payload = {
    name: input.name,
    slug: input.slug,
    description: input.description || null,
    image_url: input.imageUrl || null,
    sort_order: input.sortOrder,
    is_active: input.isActive,
  };
  const result = existingId
    ? await supabase.from("categories").update(payload).eq("id", existingId).select("slug").single()
    : await supabase.from("categories").insert(payload).select("slug").single();
  if (result.error) throw new Error("Could not save category.");
  return result.data.slug;
}

export async function setAdminCategoryActive(id: string, isActive: boolean) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("categories").update({ is_active: isActive }).eq("id", id);
  if (error) throw new Error("Could not update category.");
}

export async function getAdminProducts(filters: { search?: string; categoryId?: string; active?: string; stock?: string } = {}): Promise<AdminProductListItem[]> {
  const supabase = createSupabaseAdminClient();
  let query = supabase
    .from("products")
    .select("id,name,slug,sku,category_id,categories(name,slug),price,compare_at_price,image_url,stock,low_stock_threshold,inventory_tracking,is_active,is_best_seller,is_new,is_offer,is_featured,tags,created_at,updated_at")
    .order("created_at", { ascending: false });
  const search = cleanSearch(filters.search);
  if (search) query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%`);
  if (filters.categoryId) query = query.eq("category_id", filters.categoryId);
  if (filters.active === "active") query = query.eq("is_active", true);
  if (filters.active === "inactive") query = query.eq("is_active", false);
  const { data, error } = await query;
  if (error) throw new Error("Unable to load products.");
  let products = data.map((product) => toAdminProduct(product as unknown as Parameters<typeof toAdminProduct>[0]));
  if (filters.stock === "low") products = products.filter((product) => product.inventoryTracking && product.stock <= product.lowStockThreshold);
  return products;
}

export async function getAdminProduct(slug: string): Promise<AdminProductDetail | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("id,name,slug,sku,category_id,categories(name,slug),short_description,description,price,compare_at_price,image_url,gallery_urls,stock,low_stock_threshold,sort_order,inventory_tracking,is_active,is_best_seller,is_new,is_offer,is_featured,tags,created_at,updated_at")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error("Unable to load product.");
  if (!data) return null;
  return {
    ...toAdminProduct(data as unknown as Parameters<typeof toAdminProduct>[0]),
    shortDescription: data.short_description ?? undefined,
    description: data.description ?? undefined,
    galleryUrls: data.gallery_urls ?? [],
    sortOrder: data.sort_order ?? 0,
  };
}

export async function saveAdminProduct(input: ProductFormInput, existingId?: string) {
  const supabase = createSupabaseAdminClient();
  const duplicate = await supabase.from("products").select("id").eq("slug", input.slug).maybeSingle();
  if (duplicate.error) throw new Error("Could not validate product slug.");
  if (duplicate.data && duplicate.data.id !== existingId) throw new Error("This product slug is already used.");
  const payload = {
    name: input.name,
    slug: input.slug,
    sku: input.sku || null,
    category_id: input.categoryId,
    short_description: input.shortDescription || null,
    description: input.description || null,
    price: input.price,
    compare_at_price: input.compareAtPrice ?? null,
    image_url: input.imageUrl || null,
    gallery_urls: input.galleryUrls,
    stock: input.stock,
    low_stock_threshold: input.lowStockThreshold,
    sort_order: input.sortOrder,
    tags: input.tags,
    is_active: input.isActive,
    is_best_seller: input.isBestSeller,
    is_new: input.isNew,
    is_offer: input.isOffer,
    is_featured: input.isFeatured,
    inventory_tracking: input.inventoryTracking,
  };
  const result = existingId
    ? await supabase.from("products").update(payload).eq("id", existingId).select("slug").single()
    : await supabase.from("products").insert(payload).select("slug").single();
  if (result.error) throw new Error("Could not save product.");
  return result.data.slug;
}

export async function setAdminProductActive(id: string, isActive: boolean) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("products").update({ is_active: isActive }).eq("id", id);
  if (error) throw new Error("Could not update product.");
}

export async function getAdminOrders(filters: {
  orderStatus?: string;
  paymentStatus?: string;
  search?: string;
}): Promise<AdminOrderListItem[]> {
  const supabase = createSupabaseAdminClient();
  let query = supabase
    .from("orders")
    .select("id,order_number,customer_name,customer_phone,total,payment_method,payment_status,payment_transaction_id,order_status,created_at")
    .order("created_at", { ascending: false });

  if (filters.orderStatus && isOrderStatus(filters.orderStatus)) {
    query = query.eq("order_status", filters.orderStatus);
  }

  if (filters.paymentStatus && isPaymentStatus(filters.paymentStatus)) {
    query = query.eq("payment_status", filters.paymentStatus);
  }

  const search = cleanSearch(filters.search);
  if (search) {
    query = query.or(`order_number.ilike.%${search}%,customer_phone.ilike.%${search}%`);
  }

  const { data, error } = await query;
  if (error) throw new Error("Unable to load orders.");
  return data.map(toOrderListItem);
}

export async function getAdminOrderDetail(orderNumber: string): Promise<AdminOrderDetail | null> {
  const supabase = createSupabaseAdminClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select(
      "id,order_number,customer_name,customer_phone,customer_address,delivery_area,customer_note,payment_method,payment_status,payment_transaction_id,payment_number,order_status,subtotal,delivery_charge,total,created_at",
    )
    .eq("order_number", orderNumber.toUpperCase())
    .maybeSingle();

  if (error) throw new Error("Unable to load order.");
  if (!order) return null;

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("product_name,product_slug,product_image_url,unit_price,quantity,line_total")
    .eq("order_id", order.id)
    .order("created_at", { ascending: true });

  if (itemsError) throw new Error("Unable to load order items.");

  return {
    ...toOrderListItem(order),
    customerAddress: order.customer_address,
    deliveryArea: order.delivery_area,
    customerNote: order.customer_note ?? undefined,
    paymentNumber: order.payment_number ?? undefined,
    paymentTransactionId: order.payment_transaction_id ?? undefined,
    subtotal: Number(order.subtotal),
    deliveryCharge: Number(order.delivery_charge),
    items: items.map<AdminOrderItem>((item) => ({
      productName: item.product_name,
      productSlug: item.product_slug,
      productImageUrl: item.product_image_url ?? undefined,
      unitPrice: Number(item.unit_price),
      quantity: item.quantity,
      lineTotal: Number(item.line_total),
    })),
  };
}

export async function updateAdminOrderStatus(orderNumber: string, orderStatus: OrderStatus, paymentStatus: PaymentStatus) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("orders")
    .update({ order_status: orderStatus, payment_status: paymentStatus })
    .eq("order_number", orderNumber.toUpperCase());

  if (error) throw new Error("Unable to update order.");
}

export async function getAdminMessages(filters: { status?: string; search?: string }): Promise<AdminMessage[]> {
  const supabase = createSupabaseAdminClient();
  let query = supabase.from("contact_messages").select("id,name,phone,email,subject,message,status,created_at").order("created_at", { ascending: false });

  if (filters.status && isMessageStatus(filters.status)) {
    query = query.eq("status", filters.status);
  }

  const search = cleanSearch(filters.search);
  if (search) {
    query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%,subject.ilike.%${search}%`);
  }

  const { data, error } = await query;
  if (error) throw new Error("Unable to load messages.");
  return data.map(toAdminMessage);
}

export async function getAdminMessage(id: string): Promise<AdminMessage | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("id,name,phone,email,subject,message,status,created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error("Unable to load message.");
  return data ? toAdminMessage(data) : null;
}

export async function updateAdminMessageStatus(id: string, status: MessageStatus) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("contact_messages").update({ status }).eq("id", id);
  if (error) throw new Error("Unable to update message.");
}
