"use client";

import { useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase";

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export function useInactivityLogout() {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const supabase = createClient();

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase.auth.signOut();
        window.location.href = "/login?reason=inactivity";
      }
    }, INACTIVITY_TIMEOUT);
  }, []);

  useEffect(() => {
    const events = ["mousedown", "keydown", "scroll", "touchstart", "mousemove"];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [resetTimer]);
}
