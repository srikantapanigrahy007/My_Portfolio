import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  eyebrow?: string;
  description?: string;
  className?: string;
}

export default function SectionHeading({
  title,
  eyebrow,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-foreground">
          {eyebrow}
        </p>
      )}
      <h2 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]">
        <span className="h-6 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
