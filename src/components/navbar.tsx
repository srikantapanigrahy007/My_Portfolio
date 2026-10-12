import { Dock, DockIcon } from "@/components/magicui/dock";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getSocialIcon } from "@/lib/icon-map";
import type { Social } from "@/lib/api";
import { HomeIcon, NotebookIcon } from "lucide-react";

const tooltipClass =
  "rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background shadow-card-hover";

const dockIconClass =
  "size-full cursor-pointer rounded-full border border-border bg-background p-0 text-muted-foreground transition-colors duration-200 hover:border-foreground/20 hover:bg-muted hover:text-foreground";

const dockLinkClass =
  "rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card";

const NAV_ITEMS = [
  { href: "/", icon: HomeIcon, label: "Home" },
  { href: "/blog", icon: NotebookIcon, label: "Blog" },
];

export default function Navbar({ socials }: { socials: Social[] }) {
  return (
    <nav
      aria-label="Primary"
      className="pointer-events-none fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 flex justify-center px-3"
    >
      <Dock className="pointer-events-auto relative z-50 flex h-14 w-fit max-w-full gap-1 border-border bg-card/85 px-2 py-2 shadow-card-hover backdrop-blur-xl max-sm:overflow-x-auto max-sm:[scrollbar-width:none] sm:gap-2">
        {NAV_ITEMS.map((item) => {
          const isExternal = item.href.startsWith("http");
          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <a
                  href={item.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  aria-label={item.label}
                  className={dockLinkClass}
                >
                  <DockIcon className={dockIconClass}>
                    <item.icon className="size-full rounded-sm overflow-hidden object-contain" aria-hidden />
                  </DockIcon>
                </a>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                sideOffset={8}
                className={tooltipClass}
              >
                <p>{item.label}</p>
                <TooltipArrow className="fill-foreground" />
              </TooltipContent>
            </Tooltip>
          );
        })}
        <Separator
          orientation="vertical"
          className="mx-0.5 my-auto h-2/3 w-px bg-border sm:mx-1"
        />
        {socials
          .filter((social) => social.navbar)
          .map((social, index) => {
            const isExternal = social.url.startsWith("http");
            const IconComponent = getSocialIcon(social.icon);
            return (
              <Tooltip key={`social-${social.key}-${index}`}>
                <TooltipTrigger asChild>
                  <a
                    href={social.url}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    aria-label={social.name}
                    className={dockLinkClass}
                  >
                    <DockIcon className={dockIconClass}>
                      <IconComponent className="size-full rounded-sm overflow-hidden object-contain" aria-hidden />
                    </DockIcon>
                  </a>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  sideOffset={8}
                  className={tooltipClass}
                >
                  <p>{social.name}</p>
                  <TooltipArrow className="fill-foreground" />
                </TooltipContent>
              </Tooltip>
            );
          })}
        <Separator
          orientation="vertical"
          className="mx-0.5 my-auto h-2/3 w-px bg-border sm:mx-1"
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <DockIcon className={dockIconClass}>
              <ModeToggle className="size-full cursor-pointer text-current hover:no-underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card" />
            </DockIcon>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            sideOffset={8}
            className={tooltipClass}
          >
            <p>Theme</p>
            <TooltipArrow className="fill-foreground" />
          </TooltipContent>
        </Tooltip>
      </Dock>
    </nav>
  );
}
