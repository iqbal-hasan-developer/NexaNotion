import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";

export function PageHero({ title, description, children }: { title: string; description: string; children?: ReactNode }) {
  return (
    <section className="reveal-up overflow-hidden bg-brand-soft py-9 sm:py-12 lg:py-14">
      <Container>
        <div className="motion-card cta-surface relative overflow-hidden rounded-[1.75rem] px-6 py-10 text-white shadow-[0_24px_70px_rgba(37,99,235,0.18)] sm:rounded-[2rem] sm:px-10 sm:py-12 lg:px-14">
          <div className="soft-enter relative max-w-3xl">
            <p className="text-xs font-bold uppercase text-white/55">NexaNotion</p>
            <h1 className="text-balance mt-3 text-4xl font-extrabold leading-[1.03] sm:text-5xl lg:text-6xl">{title}</h1>
            <p className="mt-4 max-w-2xl leading-7 text-white/78 sm:text-lg">{description}</p>
            {children ? <div className="mt-7">{children}</div> : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
