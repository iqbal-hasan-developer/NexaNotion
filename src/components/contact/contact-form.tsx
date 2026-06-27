"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { siteConfig } from "@/config/site";
import { trackMetaEvent } from "@/lib/meta-pixel-client";
import { hasSupabaseBrowserEnv } from "@/lib/supabase/public-env";
import type { ApiErrorResponse } from "@/types";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (sent) {
    return (
      <div className="soft-enter rounded-[1.5rem] border border-brand-navy/8 bg-brand-soft p-8 text-center">
        <CheckCircle2 className="mx-auto size-10 text-brand-purple" />
        <h2 className="mt-4 text-2xl font-bold">Thanks for reaching out.</h2>
        <p className="mt-2 leading-7 text-brand-muted">Your message has been received. For the fastest reply, continue on WhatsApp and our team will help with products, gifts or delivery questions.</p>
        <a href={siteConfig.whatsappHref} className="motion-press mt-5 inline-flex min-h-11 items-center rounded-full bg-brand-gradient px-5 text-sm font-semibold text-white">Continue on WhatsApp</a>
        <button type="button" onClick={() => setSent(false)} className="motion-press mt-4 block w-full text-sm font-semibold text-brand-purple">Edit message</button>
      </div>
    );
  }

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        if (submitting) return;

        const formData = new FormData(event.currentTarget);
        const payload = {
          name: String(formData.get("name") ?? "").trim(),
          phone: String(formData.get("phone") ?? "").trim(),
          email: String(formData.get("email") ?? "").trim(),
          subject: String(formData.get("subject") ?? "").trim(),
          message: String(formData.get("message") ?? "").trim(),
        };

        setSubmitting(true);
        setError("");

        if (!hasSupabaseBrowserEnv()) {
          trackMetaEvent("Lead", { content_name: "Contact form" });
          setSent(true);
          setSubmitting(false);
          return;
        }

        try {
          const response = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const data = (await response.json()) as { ok: true } | ApiErrorResponse;

          if (!response.ok && (!("code" in data) || data.code !== "BACKEND_NOT_CONFIGURED")) {
            setError("error" in data ? data.error : "Something went wrong. Please try again or message us on WhatsApp.");
            return;
          }

          trackMetaEvent("Lead", { content_name: "Contact form" });
          setSent(true);
        } catch {
          setError("Something went wrong. Please try again or message us on WhatsApp.");
        } finally {
          setSubmitting(false);
        }
      }}
      className="soft-enter space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" id="contact-name" name="name" placeholder="Your name" required autoComplete="name" />
        <Field label="Phone" id="contact-phone" name="phone" placeholder="Your phone number" required inputMode="tel" autoComplete="tel" />
      </div>
      <Field label="Email" id="contact-email" name="email" placeholder={siteConfig.email} type="email" autoComplete="email" />
      <Field label="Subject" id="contact-subject" name="subject" placeholder="Product, gift or order support" required />
      <label htmlFor="contact-message" className="block text-sm font-semibold text-brand-navy">Message<textarea id="contact-message" name="message" required rows={5} placeholder="Share your product, gift or order question..." className="mt-2 w-full rounded-2xl border border-brand-navy/12 bg-white px-4 py-3 font-normal outline-none shadow-inner transition placeholder:text-brand-muted/70 focus:border-brand-purple/50 focus:ring-4 focus:ring-brand-lavender" /></label>
      {error ? <p className="soft-enter rounded-2xl bg-brand-lavender/60 p-3 text-center text-sm font-semibold leading-5 text-brand-navy">{error}</p> : null}
      <button type="submit" disabled={submitting} className="motion-press inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-gradient px-6 text-sm font-bold text-white shadow-[0_12px_30px_rgba(91,33,232,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"><Send className="size-4" />{submitting ? "Sending..." : "Send Message"}</button>
    </form>
  );
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return <label htmlFor={props.id} className="block text-sm font-semibold text-brand-navy">{label}<input {...props} className="mt-2 min-h-12 w-full rounded-full border border-brand-navy/12 bg-white px-4 font-normal outline-none shadow-inner transition placeholder:text-brand-muted/70 focus:border-brand-purple/50 focus:ring-4 focus:ring-brand-lavender" /></label>;
}
