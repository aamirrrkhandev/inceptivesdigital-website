"use client";
import { useEffect } from "react";
import { ensureGhlTracking } from "@/lib/ghl-tracking";

export default function GhlTracking() {
  useEffect(() => {
    void ensureGhlTracking().catch(() => {
      /* Submission displays a retryable error if tracking is blocked. */
    });
  }, []);
  return null;
}
