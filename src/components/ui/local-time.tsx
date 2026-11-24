"use client";

import { useEffect, useState } from "react";

const FORMAT = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Sao_Paulo",
});

/** Live local time for metadata rails. Placeholder has the same mono width. */
export function LocalTime({ className }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: number | undefined;

    const update = () => setTime(FORMAT.format(new Date()));

    const sync = () => {
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
        intervalId = undefined;
      }
      if (!document.hidden) {
        update();
        intervalId = window.setInterval(update, 20_000);
      }
    };

    sync();
    document.addEventListener("visibilitychange", sync);
    return () => {
      if (intervalId !== undefined) window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return <span className={className}>{time ?? "--:--"}</span>;
}
