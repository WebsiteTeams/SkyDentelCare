import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  inverse?: boolean;
  as?: "h1" | "h2";
  className?: string;
};

export function Eyebrow({ children, inverse }: { children: string; inverse?: boolean }) {
  return (
    <p className={cn("flex items-center gap-3 text-[0.8125rem] font-semibold uppercase tracking-[0.16em]", inverse ? "text-ice" : "text-navy")}>
      <span aria-hidden className="h-px w-8 bg-teal" />
      {children}
    </p>
  );
}

export function SectionHeading({ eyebrow, title, description, inverse, as: Tag = "h2", className }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", className)}>
      {eyebrow ? <Eyebrow inverse={inverse}>{eyebrow}</Eyebrow> : null}
      <Tag className={cn(Tag === "h1" ? "display-1" : "display-2", eyebrow && "mt-6", inverse && "text-white")}>{title}</Tag>
      {description ? <p className={cn("lede mt-6 max-w-2xl", inverse && "text-white/80")}>{description}</p> : null}
    </div>
  );
}

export function PageHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <header className="bg-ice">
      <div className="container-site pt-16 pb-14 md:pt-24 md:pb-20">
        <div className="enter">
          <SectionHeading as="h1" eyebrow={eyebrow} title={title} description={description} className="max-w-4xl" />
        </div>
      </div>
    </header>
  );
}
