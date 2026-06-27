"use client";

import { useEffect, useRef } from "react";
import { trackMetaEvent } from "@/lib/meta-pixel-client";

export function ProductMetaEvents({ slug, name, price }: { slug: string; name: string; price: number }) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackMetaEvent("ViewContent", {
      content_ids: [slug],
      content_name: name,
      content_type: "product",
      currency: "BDT",
      value: price,
    });
  }, [name, price, slug]);

  return null;
}
