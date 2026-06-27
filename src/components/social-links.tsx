import { siteConfig } from "@/config/site";

const socials = [
  { key: "facebook", label: "Follow NexaNotion on Facebook", href: siteConfig.facebookHref },
  { key: "instagram", label: "Follow NexaNotion on Instagram", href: siteConfig.instagramHref },
  { key: "tiktok", label: "Follow NexaNotion on TikTok", href: siteConfig.tiktokHref },
] as const;

type SocialKey = (typeof socials)[number]["key"];

export function SocialLinks({ variant = "footer" }: { variant?: "footer" | "contact" }) {
  const baseClass =
    variant === "footer"
      ? "border-white/15 text-white/78 hover:border-brand-purple/70 hover:bg-brand-gradient hover:text-white hover:shadow-[0_12px_30px_rgba(91,33,232,0.3)]"
      : "border-brand-navy/10 bg-white text-brand-purple shadow-[0_10px_28px_rgba(5,10,31,0.06)] hover:-translate-y-0.5 hover:border-brand-purple/40 hover:bg-[linear-gradient(135deg,#2563eb,#5b21e8)] hover:text-white";

  return (
    <div className="flex justify-center gap-2 lg:justify-start">
      {socials.map((social) => (
        <a
          key={social.key}
          href={social.href}
          aria-label={social.label}
          target="_blank"
          rel="noopener noreferrer"
          className={`motion-lift grid size-10 place-items-center rounded-full border transition duration-300 ${baseClass}`}
        >
          <SocialIcon name={social.key} />
        </a>
      ))}
    </div>
  );
}

function SocialIcon({ name }: { name: SocialKey }) {
  const common = "size-4";

  if (name === "facebook") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="currentColor">
        <path d="M14.2 8.1V6.7c0-.7.5-.9.9-.9h2.2V2.2L14.1 2c-3.6 0-4.4 2.7-4.4 4.4v1.7H6.9v3.8h2.8V22h4.1V11.9h3.1l.5-3.8h-3.2Z" />
      </svg>
    );
  }

  if (name === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={common} fill="currentColor">
      <path d="M16.6 3c.3 2.4 1.7 3.9 4 4.1v3.5a7.2 7.2 0 0 1-4-1.2v6.1c0 3.1-2.1 5.6-5.4 5.6A5.4 5.4 0 0 1 5.8 16c0-3.3 2.8-5.8 6.1-5.2v3.6c-1.2-.4-2.5.4-2.5 1.7 0 1 .8 1.7 1.8 1.7 1.1 0 1.8-.7 1.8-2V3h3.6Z" />
    </svg>
  );
}
