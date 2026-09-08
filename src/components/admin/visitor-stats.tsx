"use client";

import { useEffect, useState } from "react";
import { getVisitorStats } from "@/lib/api";

export function VisitorStats({ token }: { token: string }) {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getVisitorStats>> | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getVisitorStats(token)
      .then(setStats)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"));
  }, [token]);

  if (error) return <p className="text-xs text-destructive">{error}</p>;
  if (!stats) return <p className="text-xs text-muted-foreground">Loading...</p>;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-bold">Visitors</h3>
      <div className="rounded-lg border border-border p-4">
        <div className="text-3xl font-bold text-primary">{stats.total}</div>
        <div className="text-xs text-muted-foreground">total pageviews tracked</div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium">Recent visits</span>
        <div className="max-h-80 overflow-y-auto rounded-lg border border-border">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-muted text-left">
              <tr>
                <th className="p-2">Path</th>
                <th className="p-2">Location</th>
                <th className="p-2">When</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent.map((v, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="p-2">{v.pathname}</td>
                  <td className="p-2">{[v.city, v.country].filter(Boolean).join(", ") || "—"}</td>
                  <td className="p-2 text-muted-foreground">
                    {new Date(v.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
