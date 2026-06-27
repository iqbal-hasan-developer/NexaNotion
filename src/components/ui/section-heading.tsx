export function SectionHeading({ title, description, align = "left" }: { title: string; description?: string; align?: "left" | "center" }) {
  return (
    <div className={align === "center" ? "mx-auto mb-10 max-w-2xl text-center" : "mb-9 max-w-2xl"}>
      <h2 className="text-balance text-3xl font-bold text-brand-navy sm:text-4xl">{title}</h2>
      {description ? <p className="mt-3 text-base leading-7 text-brand-muted">{description}</p> : null}
    </div>
  );
}
