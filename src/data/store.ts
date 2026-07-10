import type { Category, Product } from "@/types";

export const categories: Category[] = [
  { slug: "ladies-bags", name: "Ladies Bags", description: "Elegant companions for workdays, weekends and celebrations.", image: "", href: "/shop?category=ladies-bags" },
  { slug: "gym-bags", name: "Gym Bags", description: "Practical, polished carryalls built to keep up with your routine.", image: "", href: "/shop?category=gym-bags" },
  { slug: "cosmetics", name: "Cosmetics", description: "Everyday beauty essentials selected for effortless routines.", image: "", href: "/shop?category=cosmetics" },
  { slug: "bracelets", name: "Bracelets", description: "Delicate details that bring a little shine to every look.", image: "", href: "/shop?category=bracelets" },
  { slug: "couple-packages", name: "Couple Packages", description: "Thoughtful pairings made to celebrate your favorite person.", image: "", href: "/shop?category=couple-packages" },
  { slug: "gift-packages", name: "Gift Packages", description: "Beautifully presented surprises for every meaningful moment.", image: "", href: "/shop?category=gift-packages" },
  { slug: "panjabi", name: "Panjabi", description: "Premium Panjabi collection for festive, casual and special occasions.", image: "", href: "/shop?category=panjabi" },
];

const imageByCategory = Object.fromEntries(categories.map((category) => [category.slug, category.image]));
const catalog: Omit<Product, "image" | "images">[] = [];

export const allProducts: Product[] = catalog.map((product) => ({ ...product, image: imageByCategory[product.categorySlug] || "", images: [imageByCategory[product.categorySlug]].filter(Boolean) }));
export const featuredProducts = allProducts.filter((product) => product.isBestSeller).slice(0, 4);
export const newArrivals = allProducts.filter((product) => product.isNew).slice(0, 4);
export const offerProducts = allProducts.filter((product) => product.isOffer);
export const giftProducts = allProducts.filter((product) => ["couple-packages", "gift-packages"].includes(product.categorySlug));
export const giftPackages = giftProducts.slice(0, 2);
export const productBySlug = new Map(allProducts.map((product) => [product.slug, product]));
