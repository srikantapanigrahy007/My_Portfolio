"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface VisitorTrackerProps {
  adminPath?: string;
}

export default function VisitorTracker({ adminPath }: VisitorTrackerProps) {
  const pathname = usePathname();

  useEffect(() => {
    const cleanPath = pathname.replace(/^\/+|\/+$/g, "");
    const cleanAdminPath = adminPath?.replace(/^\/+|\/+$/g, "") || "admin-secret-access";

    // Avoid tracking api routes or the admin dashboard path
    if (
      pathname.startsWith("/api") ||
      cleanPath === cleanAdminPath ||
      cleanPath.startsWith(cleanAdminPath + "/")
    ) {
      return;
    }

    const trackVisit = async () => {
      try {
        await fetch("/api/visitor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pathname }),
        });
      } catch (err) {
        console.error("Failed to track visitor:", err);
      }
    };

    trackVisit();
  }, [pathname, adminPath]);

  return null;
}
