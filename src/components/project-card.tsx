/* eslint-disable @next/next/no-img-element */
"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getSocialIcon } from "@/lib/icon-map";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Markdown from "react-markdown";

function ProjectImage({ src, alt }: { src: string; alt: string }) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return <div className="size-full bg-muted" />;
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="size-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
      onError={() => setImageError(true)}
    />
  );
}

interface Props {
  title: string;
  href?: string;
  description: string;
  dates: string;
  tags: readonly string[];
  link?: string;
  image?: string;
  video?: string;
  links?: readonly {
    icon: string;
    type: string;
    href: string;
  }[];
  className?: string;
}

export function ProjectCard({
  title,
  href,
  description,
  dates,
  tags,
  link,
  image,
  video,
  links,
  className,
}: Props) {
  return (
    <article
      className={cn(
        "group surface flex h-full flex-col overflow-hidden transition-[box-shadow,border-color,transform] duration-300 ease-out hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-card-hover",
        className
      )}
    >
      <div className="relative shrink-0 border-b border-border">
        <Link
          href={href || "#"}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={-1}
          aria-hidden
          className="block aspect-[16/10] w-full overflow-hidden bg-muted"
        >
          {video ? (
            <video
              src={video}
              autoPlay
              loop
              muted
              playsInline
              className="size-full object-cover object-top"
            />
          ) : image ? (
            <ProjectImage src={image} alt={title} />
          ) : (
            <div className="size-full bg-muted" />
          )}
        </Link>
        {links && links.length > 0 && (
          <div className="absolute top-3 right-3 flex flex-wrap justify-end gap-2">
            {links.map((link, idx) => {
              const LinkIcon = getSocialIcon(link.icon);
              return (
                <Link
                  href={link.href}
                  key={idx}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="rounded-full"
                >
                  <Badge
                    className="flex items-center gap-1.5 rounded-full border-white/10 bg-stone-900/85 px-2.5 py-1 text-xs font-medium text-white shadow-sm backdrop-blur-sm transition-colors hover:bg-stone-900"
                    variant="default"
                  >
                    <LinkIcon className="size-3" aria-hidden />
                    {link.type}
                  </Badge>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <h3 className="text-lg font-semibold leading-snug tracking-tight text-foreground">
              {title}
            </h3>
            <time className="text-xs font-medium text-muted-foreground">{dates}</time>
          </div>
          <Link
            href={href || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors duration-200 hover:border-primary/40 hover:bg-accent hover:text-accent-foreground"
            aria-label={`Open ${title}`}
          >
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>
        <div className="prose prose-sm max-w-full flex-1 text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
          <Markdown>{description}</Markdown>
        </div>
        {tags && tags.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-1">
            {tags.map((tag) => (
              <li
                key={tag}
                className="inline-flex h-6 items-center rounded-full border border-border bg-muted px-2.5 text-xs font-medium text-foreground/80"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
