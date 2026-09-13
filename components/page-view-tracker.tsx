"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) {
      return;
    }

    void fetch("/api/analytics", {
      body: JSON.stringify({
        eventName: "page_view",
        pathname,
      }),
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    });
  }, [pathname]);

  return null;
}
