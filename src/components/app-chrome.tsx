"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { CartProvider } from "@/components/cart/cart-provider";
import { Footer } from "@/components/footer";
import { GoogleAnalytics } from "@/components/google-analytics";
import { Header } from "@/components/header";
import { MetaPixel } from "@/components/meta-pixel";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <CartProvider>
      <Suspense fallback={null}>
        <MetaPixel />
        <GoogleAnalytics />
      </Suspense>
      <Header />
      {children}
      <Footer />
      <MobileBottomNav />
    </CartProvider>
  );
}
