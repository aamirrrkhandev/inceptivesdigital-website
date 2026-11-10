"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { loadCallRail } from "@/lib/callrail";

export default function CallRailTracking() {
  const pathname = usePathname();
  useEffect(() => {
    let disposed = false;
    void loadCallRail().then((ready) => {
      if (ready && !disposed) window.CallTrk?.swap();
    });
    return () => {
      disposed = true;
    };
  }, [pathname]);
  return null;
}
