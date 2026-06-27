"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

export function ProductGallery({
  mainImageUrl,
  galleryUrls,
  productName,
}: {
  mainImageUrl: string;
  galleryUrls: string[];
  productName: string;
}) {
  const images = useMemo(
    () => [mainImageUrl, ...galleryUrls].filter((image, index, allImages) => image && allImages.indexOf(image) === index),
    [mainImageUrl, galleryUrls],
  );
  const [selectedImage, setSelectedImage] = useState(images[0] ?? mainImageUrl);
  const selectedIndex = Math.max(0, images.indexOf(selectedImage));

  return (
    <div className="min-w-0">
      <div className="soft-enter relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[linear-gradient(145deg,#ffffff_0%,#f8faff_58%,#f3f0ff_100%)] shadow-[0_24px_70px_rgba(5,10,31,.08)] ring-1 ring-brand-navy/5">
        <div className="absolute inset-2 sm:inset-4">
          <Image
            key={selectedImage}
            src={selectedImage}
            alt={productName}
            fill
            priority
            loading="eager"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 86vw, 58vw"
            className="soft-enter object-contain object-center"
          />
        </div>
      </div>

      <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto px-1 py-2 sm:mt-5 sm:gap-4 sm:overflow-visible">
        {images.map((image, index) => {
          const selected = index === selectedIndex;

          return (
            <button
              key={image}
              type="button"
              aria-label={`View image ${index + 1} of ${productName}`}
              aria-pressed={selected}
              aria-current={selected ? "true" : undefined}
              onClick={() => setSelectedImage(image)}
              className={`motion-press relative aspect-square size-24 shrink-0 overflow-hidden rounded-[1.2rem] bg-[linear-gradient(145deg,#ffffff_0%,#f8faff_100%)] transition hover:-translate-y-0.5 hover:border-brand-blue/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/40 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-soft sm:size-32 ${
                selected ? "border-2 border-[#5B21E8] shadow-[0_0_0_3px_rgba(91,33,232,0.12)]" : "border border-brand-navy/8 shadow-sm"
              }`}
            >
              <span className="absolute inset-1.5">
                <Image src={image} alt={`${productName} view ${index + 1}`} fill sizes="128px" className="motion-image object-contain object-center" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
