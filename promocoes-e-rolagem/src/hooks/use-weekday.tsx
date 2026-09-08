import { useEffect, useState } from "react";

import { currentWeekday, type Weekday } from "@/lib/schedule";

/** De quanto em quanto tempo conferir se o dia virou. */
const CHECK_INTERVAL_MS = 60_000;

/**
 * Devolve o dia da semana atual no Brasil, e continua correto se a página
 * ficar aberta.
 *
 * Dois cuidados aqui:
 *
 * 1. O valor inicial é calculado na hora, e não depois que a tela aparece.
 *    Como servidor e navegador usam o mesmo fuso fixo do Brasil, os dois chegam
 *    ao mesmo resultado — então as promoções certas já vêm no primeiro
 *    desenho da página, sem piscar.
 *
 * 2. Mesmo assim conferimos de novo no navegador e a cada minuto. Se a página
 *    tiver vindo de cache (uma versão gerada na segunda sendo servida na
 *    terça), ou se alguém deixar o cardápio aberto virando a meia-noite, o
 *    cardápio se corrige sozinho.
 */
export function useWeekday(): Weekday {
  const [weekday, setWeekday] = useState<Weekday>(() => currentWeekday());

  useEffect(() => {
    const check = () => setWeekday(currentWeekday());
    check();
    const id = setInterval(check, CHECK_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return weekday;
}
