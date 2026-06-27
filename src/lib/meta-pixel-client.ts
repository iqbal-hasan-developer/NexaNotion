export type MetaPixelEventName = "PageView" | "ViewContent" | "AddToCart" | "InitiateCheckout" | "Purchase" | "Lead" | "Contact";

export type MetaPixelParams = {
  content_ids?: string[];
  content_name?: string;
  content_type?: "product" | "product_group";
  contents?: Array<{ id: string; quantity: number }>;
  currency?: "BDT";
  num_items?: number;
  payment_method?: string;
  value?: number;
};

declare global {
  interface Window {
    fbq?: (command: "track", eventName: MetaPixelEventName, params?: MetaPixelParams) => void;
  }
}

export function hasMetaPixel() {
  return Boolean(process.env.NEXT_PUBLIC_META_PIXEL_ID);
}

export function trackMetaEvent(eventName: MetaPixelEventName, params?: MetaPixelParams) {
  if (!hasMetaPixel() || typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", eventName, params);
}
