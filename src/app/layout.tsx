import type { Metadata } from "next";
import { Geist, Noto_Sans_Bengali } from "next/font/google";
import { AppChrome } from "@/components/app-chrome";
import { siteConfig } from "@/config/site";
import { createSeoMetadata } from "@/lib/seo";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const bangla = Noto_Sans_Bengali({ subsets: ["bengali"], variable: "--font-bangla" });

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: siteConfig.name,
    description: "Shop fashion bags, cosmetics, bracelets, Panjabi and thoughtful gift packages from NexaNotion in Bangladesh.",
    path: "/",
    keywords: ["online shopping Bangladesh", "bKash Nagad COD shopping"],
  }),
  metadataBase: new URL(siteConfig.siteUrl || siteConfig.websiteHref),
  applicationName: siteConfig.name,
  creator: siteConfig.name,
  publisher: siteConfig.name,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth"><body className={`${geist.variable} ${bangla.variable}`}><AppChrome>{children}</AppChrome></body></html>;
}
