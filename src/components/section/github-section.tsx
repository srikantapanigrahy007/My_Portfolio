import { DATA } from "@/data/resume";
import GithubCalendarView, { CalendarData, ContributionDay } from "./github-calendar-view";

export default async function GithubSection() {
  const githubUrl = DATA.contact.social.GitHub.url;
  const username = githubUrl.split("/").pop() || "srikantapanigrahy007";

  let calendarData: CalendarData = {
    username,
    githubUrl,
    total: 0,
    longestStreak: 0,
    bestDay: 0,
    weeks: [],
    monthLabels: [],
  };

  try {
    // Fetch directly from official GitHub contributions endpoint
    const res = await fetch(`https://github.com/users/${username}/contributions`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        Accept: "text/html",
      },
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const html = await res.text();

      // Extract official GitHub total count
      const totalMatch = html.match(/([\d,]+)\s+contributions?\s+in\s+the\s+last\s+year/i);
      const officialTotal = totalMatch ? parseInt(totalMatch[1].replace(/,/g, "")) : 0;

      // Extract tooltips to get exact counts per day
      const tipMatches = html.match(/<tool-tip[^>]*for="[^"]*"[^>]*>([\s\S]*?)<\/tool-tip>/gi) || [];
      const tipMap: Record<string, number> = {};
      tipMatches.forEach((tip) => {
        const forMatch = tip.match(/for="([^"]+)"/);
        const textMatch = tip.match(/>([^<]+)<\/tool-tip>/);
        if (forMatch && textMatch) {
          const forId = forMatch[1];
          const text = textMatch[1].trim();
          const countMatch = text.match(/^(\d+)\s+contribution/i);
          const count = countMatch ? parseInt(countMatch[1]) : 0;
          tipMap[forId] = count;
        }
      });

      // Extract days table cells
      const tdMatches = html.match(/<td[^>]*data-date="[^"]*"[^>]*>/gi) || [];
      const contributions: ContributionDay[] = [];

      tdMatches.forEach((td) => {
        const idMatch = td.match(/id="([^"]+)"/);
        const dateMatch = td.match(/data-date="([^"]+)"/);
        const levelMatch = td.match(/data-level="([^"]+)"/);

        if (idMatch && dateMatch) {
          const id = idMatch[1];
          const date = dateMatch[1];
          const level = levelMatch ? parseInt(levelMatch[1]) : 0;
          const count = tipMap[id] ?? (level > 0 ? level : 0);

          contributions.push({ date, count, level });
        }
      });

      // Crucial: Sort all contributions chronologically by date
      contributions.sort((a, b) => a.date.localeCompare(b.date));

      let calculatedTotal = 0;
      let bestDay = 0;
      let longestStreak = 0;
      let currentStreak = 0;

      contributions.forEach((c) => {
        calculatedTotal += c.count;
        if (c.count > bestDay) bestDay = c.count;
        if (c.count > 0) {
          currentStreak++;
          if (currentStreak > longestStreak) longestStreak = currentStreak;
        } else {
          currentStreak = 0;
        }
      });

      const total = officialTotal > 0 ? officialTotal : calculatedTotal;

      // Group into 53 chronological weeks (Sunday=0 to Saturday=6)
      const weeks: (ContributionDay | null)[][] = [];
      let currentWeek: (ContributionDay | null)[] = new Array(7).fill(null);

      contributions.forEach((c) => {
        const dt = new Date(c.date + "T00:00:00");
        const dow = dt.getDay();
        currentWeek[dow] = c;
        if (dow === 6) {
          weeks.push(currentWeek);
          currentWeek = new Array(7).fill(null);
        }
      });

      if (currentWeek.some((x) => x !== null)) {
        weeks.push(currentWeek);
      }

      // Extract month labels aligned with starting columns
      const monthLabels: { month: string; colIndex: number }[] = [];
      let prevMonth = "";
      let lastCol = -4;

      weeks.forEach((week, wIdx) => {
        const validDay = week.find((d) => d !== null);
        if (!validDay) return;
        const m = new Date(validDay.date + "T00:00:00").toLocaleString("en-US", { month: "short" });
        if (m !== prevMonth) {
          if (wIdx - lastCol >= 3) {
            monthLabels.push({ month: m, colIndex: wIdx });
            lastCol = wIdx;
          }
          prevMonth = m;
        }
      });

      calendarData = {
        username,
        githubUrl,
        total,
        longestStreak,
        bestDay,
        weeks,
        monthLabels,
      };
    }
  } catch (err) {
    console.error("Failed to fetch official GitHub contributions:", err);
  }

  return (
    <section id="github">
      <div className="flex min-h-0 flex-col gap-y-8">
        {/* Section Header */}
        <div className="flex flex-col gap-y-4 items-center justify-center">
          <div className="flex items-center w-full">
            <div className="flex-1 h-px bg-linear-to-r from-transparent from-5% via-border via-95% to-transparent" />
            <div className="border bg-primary z-10 rounded-xl px-4 py-1">
              <span className="text-background text-sm font-medium">Contributions</span>
            </div>
            <div className="flex-1 h-px bg-linear-to-l from-transparent from-5% via-border via-95% to-transparent" />
          </div>
          <div className="flex flex-col gap-y-3 items-center justify-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">GitHub Contributions</h2>
            <p className="text-muted-foreground text-sm text-center max-w-[600px]">
              My open-source contributions and development activity over the past year.
            </p>
          </div>
        </div>

        {/* Calendar Card Component */}
        <GithubCalendarView data={calendarData} />
      </div>
    </section>
  );
}
