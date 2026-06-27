import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

const defaultKeywords = [
  "NexaNotion",
  "Bangladesh fashion store",
  "ladies bags Bangladesh",
  "gym bags Bangladesh",
  "cosmetics Bangladesh",
  "gift packages Bangladesh",
  "Panjabi Bangladesh",
];

const defaultImage = "/images/nexanotion-hero.png";

function getConfiguredSiteUrl() {
  return siteConfig.siteUrl || "";
}

export function getSitemapBaseUrl() {
  return getConfiguredSiteUrl() || siteConfig.websiteHref;
}

export function absoluteUrl(path = "") {
  const baseUrl = getConfiguredSiteUrl();
  if (!baseUrl) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function createSeoMetadata({
  title,
  description,
  path = "/",
  image = defaultImage,
  keywords = [],
  type = "website",
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  keywords?: string[];
  type?: "website" | "article";
  noIndex?: boolean;
}): Metadata {
  const canonical = absoluteUrl(path);
  const imageUrl = absoluteUrl(image) ?? image;
  const fullTitle = title === siteConfig.name ? `${siteConfig.name} | Fashion, Beauty & Gifts in Bangladesh` : `${title} | ${siteConfig.name}`;

  return {
    title: fullTitle,
    description,
    keywords: [...defaultKeywords, ...keywords],
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      type,
      title: fullTitle,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: "en_BD",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: `${siteConfig.name} online store` }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}
