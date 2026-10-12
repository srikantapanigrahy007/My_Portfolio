/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Experience } from "@/lib/api";
import { ChevronDown, ChevronRight } from "lucide-react";
import Markdown from "react-markdown";
import { cn } from "@/lib/utils";

function LogoImage({ src, alt }: { src: string; alt: string }) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return (
      <div className="size-10 sm:size-11 flex-none rounded-full border border-border bg-muted" />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="size-10 sm:size-11 flex-none overflow-hidden rounded-full border border-border bg-white object-contain p-1"
      onError={() => setImageError(true)}
    />
  );
}

export default function WorkSection({ experience }: { experience: Experience[] }) {
  return (
    <Accordion type="single" collapsible className="grid w-full gap-1">
      {experience.map((work) => (
        <AccordionItem
          key={work._id}
          value={work._id}
          className="grid w-full rounded-xl border-b-0 transition-colors duration-200 has-[[data-state=open]]:bg-muted/60"
        >
          <AccordionTrigger className="group cursor-pointer rounded-xl p-3 hover:bg-muted hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card [&>svg]:hidden">
            <div className="flex w-full items-center justify-between gap-x-4 text-left">
              <div className="flex min-w-0 flex-1 items-center gap-x-4">
                <LogoImage src={work.logoUrl} alt={work.company} />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-center gap-2 text-base font-semibold leading-snug text-foreground">
                    {work.company}
                    <span className="relative inline-flex items-center w-3.5 h-3.5">
                      <ChevronRight
                        className={cn(
                          "absolute h-3.5 w-3.5 shrink-0 text-muted-foreground stroke-2 transition-all duration-300 ease-out",
                          "translate-x-0 opacity-0",
                          "group-hover:translate-x-1 group-hover:opacity-100",
                          "group-data-[state=open]:opacity-0 group-data-[state=open]:translate-x-0"
                        )}
                      />
                      <ChevronDown
                        className={cn(
                          "absolute h-3.5 w-3.5 shrink-0 text-muted-foreground stroke-2 transition-all duration-200",
                          "opacity-0 rotate-0",
                          "group-data-[state=open]:opacity-100 group-data-[state=open]:rotate-180"
                        )}
                      />
                    </span>
                  </div>
                  <div className="font-sans text-sm font-normal text-muted-foreground">
                    {work.title}
                  </div>
                  <div className="text-xs tabular-nums font-normal text-muted-foreground sm:hidden">
                    {work.start} - {work.end || "Present"}
                  </div>
                </div>
              </div>
              <div className="hidden flex-none items-center gap-1 text-right text-sm font-normal tabular-nums text-muted-foreground sm:flex">
                <span>
                  {work.start} - {work.end || "Present"}
                </span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-4 pt-1 text-sm text-muted-foreground sm:pl-[4.5rem]">
            {work.description ? (
              <div className="prose prose-sm max-w-3xl text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
                <Markdown>{work.description}</Markdown>
              </div>
            ) : null}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

