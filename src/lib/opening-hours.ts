import { useEffect, useState } from "react";

export const OPEN_TIME = "18h30";
export const CLOSE_TIME = "23h";

const OPEN_MINUTES = 18 * 60 + 30; // 18:30
const CLOSE_MINUTES = 23 * 60; // 23:00

export interface OpenStatus {
  isOpen: boolean;
  label: string;
}

function getSaoPauloMinutes(date: Date): number {
  const parts = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return hour * 60 + minute;
}

export function getOpenStatus(date: Date = new Date()): OpenStatus {
  const minutes = getSaoPauloMinutes(date);
  const isOpen = minutes >= OPEN_MINUTES && minutes < CLOSE_MINUTES;
  return {
    isOpen,
    label: isOpen ? `Aberto agora · até às ${CLOSE_TIME}` : `Fechado · abre às ${OPEN_TIME}`,
  };
}

/** Retorna null durante SSR/primeira renderização e atualiza a cada 30s no cliente. */
export function useOpenStatus(): OpenStatus | null {
  const [status, setStatus] = useState<OpenStatus | null>(null);

  useEffect(() => {
    const update = () => setStatus(getOpenStatus());
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  return status;
}
