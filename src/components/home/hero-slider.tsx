"use client";

import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

type HeroCta = {
  label: string;
  href: string;
};

type HeroSlide = {
  image: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: HeroCta;
  secondaryCta: HeroCta;
  imagePosition: string;
};

const slides: HeroSlide[] = [
  {
    image: "/images/hero-slide-1.webp",
    imageAlt: "NexaNotion fashion, beauty and gift collection campaign banner",
    eyebrow: "NEXANOTION COLLECTION",
    title: "Style, Beauty & Gifts \u2014 All in One Notion.",
    description: "Discover trendy bags, cosmetics, bracelets and thoughtful gift packages for every occasion.",
    primaryCta: { label: "Shop Now", href: "/shop" },
    secondaryCta: { label: "Order on WhatsApp", href: siteConfig.whatsappHref },
    imagePosition: "center center",
  },
  {
    image: "/images/hero-slide-2.webp",
    imageAlt: "NexaNotion premium gift packages and surprise boxes campaign banner",
    eyebrow: "GIFT READY PICKS",
    title: "Thoughtful Gifts, Beautifully Packed.",
    description: "Explore couple packages, birthday gifts and premium surprise boxes made for special moments.",
    primaryCta: { label: "Explore Gift Packages", href: "/gift-packages" },
    secondaryCta: { label: "Customize on WhatsApp", href: siteConfig.whatsappHref },
    imagePosition: "center center",
  },
  {
    image: "/images/hero-slide-3.webp",
    imageAlt: "NexaNotion bags, beauty essentials and accessories campaign banner",
    eyebrow: "NEW EVERYDAY STYLE",
    title: "Carry Style. Glow Every Day.",
    description: "Shop stylish bags, beauty essentials and accessories selected for your everyday lifestyle.",
    primaryCta: { label: "Shop Collection", href: "/shop" },
    secondaryCta: { label: "View New Arrivals", href: "/shop?sort=newest" },
    imagePosition: "center center",
  },
];

function subscribeToReducedMotion(callback: () => void) {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);

  return () => mediaQuery.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribeToReducedMotion, getReducedMotionSnapshot, getReducedMotionServerSnapshot);
}

export function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set());
  const prefersReducedMotion = usePrefersReducedMotion();

  const activeSlide = slides[activeIndex];

  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const goToPrevious = useCallback(() => {
    setActiveIndex((current) => (current === 0 ? slides.length - 1 : current - 1));
  }, []);

  const goToNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % slides.length);
  }, []);

  const markImageFailed = useCallback((image: string) => {
    setFailedImages((current) => new Set(current).add(image));
  }, []);

  useEffect(() => {
    if (isPaused || prefersReducedMotion) return;

    const intervalId = window.setInterval(goToNext, 3000);
    return () => window.clearInterval(intervalId);
  }, [goToNext, isPaused, prefersReducedMotion]);

  const fallbackPattern = useMemo(
    () => ({
      background:
        "radial-gradient(circle at 74% 24%, rgba(91,33,232,.42), transparent 28%), linear-gradient(135deg, #050A1F 0%, #102a8c 46%, #5B21E8 100%)",
    }),
    [],
  );

  return (
    <section
      id="home"
      aria-roledescription="carousel"
      aria-label="NexaNotion featured campaigns"
      className="relative isolate min-h-[620px] overflow-hidden bg-brand-navy text-white sm:min-h-[660px] lg:min-h-[620px] xl:min-h-[690px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div className="absolute inset-0" style={fallbackPattern}>
        {slides.map((slide, index) => {
          const imageFailed = failedImages.has(slide.image);

          return (
            <div
              key={slide.image}
              aria-hidden={activeIndex !== index}
              className={`absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none ${activeIndex === index ? "opacity-100" : "opacity-0"}`}
            >
              {!imageFailed ? (
                <Image
                  src={slide.image}
                  alt={slide.imageAlt}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover"
                  style={{ objectPosition: slide.imagePosition }}
                  onError={() => markImageFailed(slide.image)}
                />
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,10,31,0.94),rgba(5,10,31,0.72),rgba(91,33,232,0.22),transparent)] sm:bg-[linear-gradient(90deg,rgba(5,10,31,0.9),rgba(5,10,31,0.62),rgba(91,33,232,0.12),transparent)]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-brand-navy/45 to-transparent" />

      <Container className="relative z-10 flex min-h-[620px] items-center pb-24 pt-16 sm:min-h-[660px] sm:pb-28 lg:min-h-[620px] lg:pb-16 xl:min-h-[690px]">
        <div className="reveal-up max-w-[560px]">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/72">{activeSlide.eyebrow}</p>
          <h1 className="mt-5 text-balance text-[2.55rem] font-extrabold leading-[1.02] text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.24)] sm:text-6xl lg:text-[4.8rem]">
            {activeSlide.title}
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-white/82 sm:text-lg">{activeSlide.description}</p>
          <div className="soft-enter mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href={activeSlide.primaryCta.href} variant="light" className="shadow-[0_18px_36px_rgba(255,255,255,0.18)]">
              {activeSlide.primaryCta.label}
              <ArrowRight className="size-4" />
            </Button>
            <Button href={activeSlide.secondaryCta.href} className="border border-white/28 bg-white/10 text-white shadow-none backdrop-blur-md hover:bg-white/18">
              {activeSlide.secondaryCta.href.includes("wa.me") ? <MessageCircle className="size-4" /> : null}
              {activeSlide.secondaryCta.label}
            </Button>
          </div>
        </div>
      </Container>

      <div className="pointer-events-none absolute inset-x-0 bottom-7 z-20 flex items-center justify-center gap-3 sm:bottom-9">
        <div className="pointer-events-auto flex rounded-full bg-white/12 p-1.5 backdrop-blur-md">
          {slides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              aria-label={`Go to slide ${index + 1}: ${slide.title}`}
              aria-current={activeIndex === index}
              onClick={() => goToSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 motion-reduce:transition-none ${activeIndex === index ? "w-8 bg-white" : "w-2.5 bg-white/45 hover:bg-white/75"}`}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        aria-label="Show previous hero slide"
        onClick={goToPrevious}
        className="motion-press absolute left-6 top-1/2 z-20 hidden size-12 -translate-y-1/2 place-items-center rounded-full border border-white/18 bg-white/12 text-white backdrop-blur-md transition hover:bg-white/20 lg:grid"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        aria-label="Show next hero slide"
        onClick={goToNext}
        className="motion-press absolute right-6 top-1/2 z-20 hidden size-12 -translate-y-1/2 place-items-center rounded-full border border-white/18 bg-white/12 text-white backdrop-blur-md transition hover:bg-white/20 lg:grid"
      >
        <ChevronRight className="size-5" />
      </button>
    </section>
  );
}
