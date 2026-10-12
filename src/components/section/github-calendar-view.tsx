"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Icons } from "@/components/icons";
import { ArrowUpRight, Calendar, Flame, TrendingUp, Trophy } from "lucide-react";

export interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface CalendarData {
  username: string;
  githubUrl: string;
  total: number;
  longestStreak: number;
  bestDay: number;
  weeks: (ContributionDay | null)[][];
  monthLabels: { month: string; colIndex: number }[];
}

// Mint-to-emerald scale keyed to GitHub's per-day contribution level (0 = none, 4 = most).
// Each level has a slightly darker border and a darker hover border; dark theme uses a deeper scale.
const LEVEL_CLASSES: Record<number, string> = {
  0: "bg-[#8fcdb5] border-[#d3eedf] hover:border-[#9fd8b9] dark:bg-[#12231b] dark:border-[#1b3428] dark:hover:border-[#2f5a45]",
  1: "bg-[#d1fae5] border-[#a7f3d0] hover:border-[#6ee7b7] dark:bg-[#064e3b] dark:border-[#065f46] dark:hover:border-[#0a8a63]",
  2: "bg-[#6ee7b7] border-[#4fd6a2] hover:border-[#10b981] dark:bg-[#047857] dark:border-[#059669] dark:hover:border-[#34d399]",
  3: "bg-[#34d399] border-[#1fbf86] hover:border-[#059669] dark:bg-[#10b981] dark:border-[#34d399] dark:hover:border-[#6ee7b7]",
  4: "bg-[#059669] border-[#047857] hover:border-[#065f46] dark:bg-[#34d399] dark:border-[#6ee7b7] dark:hover:border-[#a7f3d0]",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function GithubCalendarView({ data }: { data: CalendarData }) {
  const { username, githubUrl, total, longestStreak, bestDay, weeks, monthLabels } = data;

  return (
    <div className="w-full rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col gap-6 transition-transform duration-300 ease-out will-change-transform hover:shadow-2xl hover:shadow-primary/15 hover:[transform:rotateX(1.5deg)_translateY(-5px)_scale(1.01)]">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: GitHub Profile Info */}
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-foreground text-background flex items-center justify-center shrink-0">
            <Icons.github className="size-6 fill-current" />
          </div>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-bold text-foreground hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors flex items-center gap-1 group"
          >
            <span>@{username}</span>
            <ArrowUpRight className="size-4 text-muted-foreground opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </a>
        </div>

        {/* Right: Trending Activity Stat */}
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
            <TrendingUp className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground leading-tight">Activity in the last year</span>
            <span className="text-sm font-semibold text-foreground">
              <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{total}</strong> contributions
            </span>
          </div>
        </div>
      </div>

      {/* Center: Contribution Heatmap Grid */}
      <div className="w-full overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        <div className="w-max mx-auto flex flex-col gap-1.5 select-none px-1">
          {/* Month Labels Header */}
          <div className="relative h-4 w-[822px] text-[11px] text-muted-foreground font-medium">
            {monthLabels.map((m, idx) => (
              <span
                key={`${m.month}-${idx}`}
                className="absolute top-0"
                style={{ left: `${m.colIndex * 15.5}px` }}
              >
                {m.month}
              </span>
            ))}
          </div>

          {/* Grid Rows & Columns (53 week columns, 7 day rows) */}
          <TooltipProvider delayDuration={50}>
            <div className="flex gap-[3.5px] shrink-0">
              {weeks.map((week, wIdx) => (
                <div key={`week-${wIdx}`} className="flex flex-col gap-[3.5px] shrink-0">
                  {week.map((day, dIdx) => {
                    if (!day) {
                      return <div key={`empty-${wIdx}-${dIdx}`} className="size-3 shrink-0" />;
                    }

                    // Days with zero contributions always render as level 0, matching the tooltip.
                    const level = day.count === 0 ? 0 : day.level;
                    const levelClass = LEVEL_CLASSES[level] ?? LEVEL_CLASSES[0];

                    return (
                      <Tooltip key={day.date}>
                        <TooltipTrigger asChild>
                          <div
                            className={`size-3 shrink-0 rounded-[2.5px] border transition-[background-color,border-color] duration-200 ease-out ${levelClass}`}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top" sideOffset={5} className="font-sans text-xs">
                          <p className="font-semibold">
                            {day.count === 0 ? "No contributions" : `${day.count} contribution${day.count === 1 ? "" : "s"}`}
                          </p>
                          <p className="text-[11px] opacity-80">{formatDate(day.date)}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
          </TooltipProvider>
        </div>
      </div>

      {/* Bottom Summary Bar */}
      <div className="flex flex-wrap items-center justify-start gap-3 sm:gap-4 pt-4 border-t border-border/50">
        {/* Total Contributions */}
        <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 px-4 py-2.5">
          <div className="size-9 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
            <Calendar className="size-4.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-foreground leading-tight">{total}</span>
            <span className="text-xs text-muted-foreground">Contributions</span>
          </div>
        </div>

        {/* Longest Streak */}
        <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 px-4 py-2.5">
          <div className="size-9 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
            <Flame className="size-4.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-foreground leading-tight">{longestStreak}</span>
            <span className="text-xs text-muted-foreground">Longest streak</span>
          </div>
        </div>

        {/* Best Day */}
        <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 px-4 py-2.5">
          <div className="size-9 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
            <Trophy className="size-4.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-foreground leading-tight">{bestDay}</span>
            <span className="text-xs text-muted-foreground">Best day</span>
          </div>
        </div>
      </div>
    </div>
  );
}
