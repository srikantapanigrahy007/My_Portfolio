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

const LEVEL_CLASSES: Record<number, string> = {
  0: "bg-[#ebedf0] dark:bg-[#21262d] border-[#d0d7de] dark:border-[#30363d] hover:border-zinc-500 dark:hover:border-zinc-400",
  1: "bg-[#9be9a8] dark:bg-[#0e4429] border-[#7cdb8c] dark:border-[#006d32] hover:brightness-110",
  2: "bg-[#40c463] dark:bg-[#006d32] border-[#33af54] dark:border-[#26a641] hover:brightness-110",
  3: "bg-[#30a14e] dark:bg-[#26a641] border-[#25873f] dark:border-[#39d353] hover:brightness-110",
  4: "bg-[#216e39] dark:bg-[#39d353] border-[#18532b] dark:border-[#56ff7a] hover:brightness-110",
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
    <div className="surface flex w-full flex-col gap-6 p-5 sm:p-8">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: GitHub Profile Info */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="size-10 rounded-full bg-foreground text-background flex items-center justify-center shrink-0">
            <Icons.github className="size-6 fill-current" />
          </div>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex min-w-0 items-center gap-1 rounded-sm text-base font-semibold text-foreground transition-colors hover:text-accent-foreground sm:text-lg"
          >
            <span className="min-w-0 break-all">@{username}</span>
            <ArrowUpRight className="size-4 shrink-0 text-muted-foreground opacity-60 transition-[opacity,transform] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" aria-hidden />
          </a>
        </div>

        {/* Right: Trending Activity Stat */}
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-600/20">
            <TrendingUp className="size-5" aria-hidden />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground leading-tight">Activity in the last year</span>
            <span className="text-sm font-semibold text-foreground">
              <strong className="text-emerald-700 dark:text-emerald-400 font-semibold">{total}</strong> contributions
            </span>
          </div>
        </div>
      </div>

      {/* Center: Contribution Heatmap Grid */}
      <div className="w-full overflow-x-auto overscroll-x-contain pb-3 pt-1 [scrollbar-width:thin]">
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

                    const levelClass = LEVEL_CLASSES[day.level] || LEVEL_CLASSES[0];

                    return (
                      <Tooltip key={day.date}>
                        <TooltipTrigger asChild>
                          <div
                            className={`size-3 shrink-0 rounded-[2.5px] border transition-[filter,border-color] duration-150 ${levelClass}`}
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
      <div className="grid grid-cols-1 gap-3 border-t border-border pt-6 sm:grid-cols-3">
        {/* Total Contributions */}
        <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
          <div className="size-9 rounded-lg bg-accent text-accent-foreground flex items-center justify-center shrink-0 border border-primary/15">
            <Calendar className="size-4.5" aria-hidden />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold tabular-nums text-foreground leading-tight">{total}</span>
            <span className="text-xs text-muted-foreground">Contributions</span>
          </div>
        </div>

        {/* Longest Streak */}
        <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
          <div className="size-9 rounded-lg bg-accent text-accent-foreground flex items-center justify-center shrink-0 border border-primary/15">
            <Flame className="size-4.5" aria-hidden />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold tabular-nums text-foreground leading-tight">{longestStreak}</span>
            <span className="text-xs text-muted-foreground">Longest streak</span>
          </div>
        </div>

        {/* Best Day */}
        <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
          <div className="size-9 rounded-lg bg-accent text-accent-foreground flex items-center justify-center shrink-0 border border-primary/15">
            <Trophy className="size-4.5" aria-hidden />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold tabular-nums text-foreground leading-tight">{bestDay}</span>
            <span className="text-xs text-muted-foreground">Best day</span>
          </div>
        </div>
      </div>
    </div>
  );
}
