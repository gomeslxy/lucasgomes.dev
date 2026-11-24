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
    const update = () => setTime(FORMAT.format(new Date()));
    update();
    const id = window.setInterval(update, 20_000);
    return () => window.clearInterval(id);
  }, []);

  return <span className={className}>{time ?? "--:--"}</span>;
}
