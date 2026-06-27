import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const confirmation = "NEXANOTION_PRODUCTION_CLEANUP";
const applyMode = process.argv.includes("--apply");
const confirmed = process.env.CLEANUP_CONFIRM === confirmation;
const dryRun = !applyMode || !confirmed;
const suspiciousPattern = /\b(demo|sample|test|qa|lorem|placeholder|adidas|jordan)\b|nn-demo|qa test|example\.com/i;
const obviousFakePhonePattern = /^(0+|1+|1234567890|0123456789|01700000000|01800000000|01900000000)$/;

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  gallery_urls: string[] | null;
  is_active: boolean | null;
};

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean | null;
};

type OrderRow = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_note: string | null;
  created_at: string | null;
};

type ContactMessageRow = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  subject: string | null;
  message: string;
  created_at: string | null;
};

type StorageFile = {
  name: string;
  id?: string | null;
  metadata?: unknown;
};

function loadDotEnvLocal() {
  const envPath = resolve(process.cwd(), ".env.local");
  try {
    const content = readFileSync(envPath, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
      const [rawKey, ...rawValue] = trimmed.split("=");
      const key = rawKey.trim();
      if (process.env[key]) continue;
      process.env[key] = rawValue.join("=").trim().replace(/^['"]|['"]$/g, "");
    }
  } catch {
    // .env.local is optional for dry-run reporting in deployed environments.
  }
}

function compact(value: Array<string | null | undefined>) {
  return value.filter((item): item is string => Boolean(item?.trim())).join(" ");
}

function looksSuspicious(...values: Array<string | null | undefined>) {
  return suspiciousPattern.test(compact(values));
}

function storagePathFromUrl(value: string | null | undefined) {
  if (!value) return null;
  const marker = "/storage/v1/object/public/products/";
  const markerIndex = value.indexOf(marker);
  if (markerIndex >= 0) return decodeURIComponent(value.slice(markerIndex + marker.length));
  return value.startsWith("products/") || value.startsWith("categories/") ? value : null;
}

function printList<T>(title: string, rows: T[], format: (row: T) => string) {
  console.log(`\n${title}: ${rows.length}`);
  for (const row of rows) console.log(`- ${format(row)}`);
}

async function listStorageFiles(
  supabase: SupabaseClient,
  prefix = "",
): Promise<string[]> {
  const { data, error } = await supabase.storage.from("products").list(prefix || undefined, { limit: 1000 });
  if (error || !data) return [];

  const paths: string[] = [];
  for (const item of data as StorageFile[]) {
    const path = prefix ? `${prefix}/${item.name}` : item.name;
    const isFile = Boolean(item.id || item.metadata);
    if (isFile) {
      paths.push(path);
    } else {
      paths.push(...await listStorageFiles(supabase, path));
    }
  }
  return paths;
}

async function main() {
  loadDotEnvLocal();

  console.log("NexaNotion production cleanup dry-run");
  console.log("Backup required: create a Supabase database export and storage backup before apply mode.");
  console.log(`Mode: ${dryRun ? "DRY RUN" : "APPLY"}`);

  if (applyMode && !confirmed) {
    console.log(`Apply mode refused. Set CLEANUP_CONFIRM=${confirmation} to enable destructive actions.`);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    console.log("Supabase admin env is missing. No remote data was inspected.");
    return;
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const [productsResult, categoriesResult, ordersResult, messagesResult, orderItemsResult] = await Promise.all([
    supabase.from("products").select("id,name,slug,sku,short_description,description,image_url,gallery_urls,is_active"),
    supabase.from("categories").select("id,name,slug,description,image_url,is_active"),
    supabase.from("orders").select("id,order_number,customer_name,customer_phone,customer_address,customer_note,created_at"),
    supabase.from("contact_messages").select("id,name,phone,email,subject,message,created_at"),
    supabase.from("order_items").select("order_id,product_name,product_slug"),
  ]);

  if (productsResult.error || categoriesResult.error || ordersResult.error || messagesResult.error || orderItemsResult.error) {
    console.log("One or more Supabase reads failed. No cleanup actions were applied.");
    return;
  }

  const products = (productsResult.data ?? []) as ProductRow[];
  const categories = (categoriesResult.data ?? []) as CategoryRow[];
  const orders = (ordersResult.data ?? []) as OrderRow[];
  const messages = (messagesResult.data ?? []) as ContactMessageRow[];
  const orderItems = (orderItemsResult.data ?? []) as Array<{ order_id: string | null; product_name: string; product_slug: string }>;

  const suspiciousProducts = products.filter((product) =>
    looksSuspicious(product.name, product.slug, product.sku, product.short_description, product.description),
  );
  const suspiciousCategories = categories.filter((category) =>
    looksSuspicious(category.name, category.slug, category.description),
  );
  const suspiciousOrderIds = new Set(orderItems.filter((item) => looksSuspicious(item.product_name, item.product_slug)).map((item) => item.order_id).filter(Boolean));
  const suspiciousOrders = orders.filter((order) =>
    suspiciousOrderIds.has(order.id) ||
    looksSuspicious(order.order_number, order.customer_name, order.customer_address, order.customer_note) ||
    obviousFakePhonePattern.test(order.customer_phone),
  );
  const suspiciousMessages = messages.filter((message) =>
    looksSuspicious(message.name, message.email, message.subject, message.message) ||
    (message.phone ? obviousFakePhonePattern.test(message.phone) : false),
  );

  const referencedStoragePaths = new Set<string>();
  for (const product of products.filter((item) => item.is_active !== false)) {
    const mainPath = storagePathFromUrl(product.image_url);
    if (mainPath) referencedStoragePaths.add(mainPath);
    for (const urlValue of product.gallery_urls ?? []) {
      const galleryPath = storagePathFromUrl(urlValue);
      if (galleryPath) referencedStoragePaths.add(galleryPath);
    }
  }
  for (const category of categories.filter((item) => item.is_active !== false)) {
    const categoryPath = storagePathFromUrl(category.image_url);
    if (categoryPath) referencedStoragePaths.add(categoryPath);
  }

  const storageFiles = await listStorageFiles(supabase);
  const suspiciousStorageFiles = storageFiles.filter((file) => suspiciousPattern.test(file) && !referencedStoragePaths.has(file));
  const unreferencedStorageFiles = storageFiles.filter((file) => !referencedStoragePaths.has(file) && !suspiciousStorageFiles.includes(file));

  printList("Products to archive as clear demo/test", suspiciousProducts, (product) => `${product.name} (${product.slug}) active=${product.is_active !== false}`);
  printList("Categories to archive as clear demo/test", suspiciousCategories, (category) => `${category.name} (${category.slug}) active=${category.is_active !== false}`);
  printList("Orders to delete as clear QA/test", suspiciousOrders, (order) => `${order.order_number} / ${order.customer_name} / ${order.created_at ?? "unknown date"}`);
  printList("Contact messages to delete as clear QA/test", suspiciousMessages, (message) => `${message.name} / ${message.email ?? "no email"} / ${message.created_at ?? "unknown date"}`);
  printList("Storage files to delete as clear QA/test and unreferenced", suspiciousStorageFiles, (file) => file);
  printList("Unreferenced storage files skipped as uncertain", unreferencedStorageFiles, (file) => file);

  if (dryRun) return;

  if (suspiciousProducts.length) {
    await supabase.from("products").update({ is_active: false }).in("id", suspiciousProducts.map((product) => product.id));
  }
  if (suspiciousCategories.length) {
    await supabase.from("categories").update({ is_active: false }).in("id", suspiciousCategories.map((category) => category.id));
  }
  if (suspiciousOrders.length) {
    await supabase.from("orders").delete().in("id", suspiciousOrders.map((order) => order.id));
  }
  if (suspiciousMessages.length) {
    await supabase.from("contact_messages").delete().in("id", suspiciousMessages.map((message) => message.id));
  }
  if (suspiciousStorageFiles.length) {
    await supabase.storage.from("products").remove(suspiciousStorageFiles);
  }

  console.log("\nApply mode complete. Review Supabase admin logs and run production QA.");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Cleanup failed.");
  process.exit(1);
});
