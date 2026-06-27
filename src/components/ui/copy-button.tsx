"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type CopyButtonProps = {
  value: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  iconClassName?: string;
  ariaLabel?: string;
};

export function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied",
  className = "",
  iconClassName = "size-4",
  ariaLabel,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copyValue() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copyValue}
      aria-label={ariaLabel ?? label}
      className={`motion-press inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-brand-purple/20 bg-white px-4 text-sm font-black text-brand-purple transition hover:bg-brand-lavender/60 focus:outline-none focus:ring-4 focus:ring-brand-lavender ${className}`}
    >
      {copied ? <Check className={iconClassName} /> : <Copy className={iconClassName} />}
      {copied ? copiedLabel : label}
    </button>
  );
}
