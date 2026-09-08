"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { trackVisit } from "@/lib/api";

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackVisit(pathname);
  }, [pathname]);

  return null;
}
