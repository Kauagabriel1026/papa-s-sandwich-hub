/**
 * Calendário de disponibilidade dos itens do cardápio.
 *
 * Cada item pode declarar em quais dias da semana ele é vendido. Quem não
 * declara nada é vendido todo dia — assim o cardápio inteiro continua
 * funcionando sem precisar marcar item por item.
 *
 * O dia é sempre calculado no fuso do Brasil, e não no fuso do aparelho de quem
 * está acessando. Um cliente com o celular configurado errado, ou acessando de
 * outro país, precisa ver a promoção de segunda no mesmo momento em que ela
 * vale na sanduicheria.
 */

import { addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";

/** 0 = domingo, 1 = segunda, ... 6 = sábado (mesma numeração do JavaScript). */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const MONDAY: Weekday = 1;

const TIME_ZONE = "America/Sao_Paulo";

const WEEKDAY_INDEX: Record<string, Weekday> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

/**
 * Que dia da semana é agora no Brasil.
 *
 * Pedimos o nome curto do dia em inglês porque essa saída é estável: em
 * português o Intl varia entre "seg", "seg." e "segunda-feira" conforme o
 * navegador, e uma dessas variações quebraria a comparação silenciosamente.
 */
export function currentWeekday(date: Date = new Date()): Weekday {
  const short = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    weekday: "short",
  }).format(date);
  return WEEKDAY_INDEX[short] ?? (date.getDay() as Weekday);
}

/** "segunda-feira", "terça-feira"... */
export function weekdayName(weekday: Weekday): string {
  // 2024-01-07 foi um domingo, então somar o índice cai no dia certo.
  const reference = addDays(new Date(2024, 0, 7), weekday);
  return format(reference, "EEEE", { locale: ptBR });
}

/** "segunda", "terça"... — versão curta, para caber em frases. */
export function weekdayShortName(weekday: Weekday): string {
  return weekdayName(weekday).replace("-feira", "");
}

/** Item sem dias declarados vale todo dia. */
export function isAvailableOn(availableWeekdays: Weekday[] | undefined, today: Weekday): boolean {
  if (!availableWeekdays || availableWeekdays.length === 0) return true;
  return availableWeekdays.includes(today);
}

/**
 * Quantos dias faltam até a próxima vez que o item é vendido.
 * Devolve 0 se for hoje e null se o item não tem dia definido.
 */
export function daysUntilNext(
  availableWeekdays: Weekday[] | undefined,
  today: Weekday,
): number | null {
  if (!availableWeekdays || availableWeekdays.length === 0) return null;

  let menor = 7;
  for (const day of availableWeekdays) {
    // O "+ 7) % 7" faz a semana dar a volta: de sexta (5) para segunda (1)
    // são 3 dias, não -4.
    const distancia = (day - today + 7) % 7;
    if (distancia < menor) menor = distancia;
  }
  return menor;
}

/**
 * Só o "quando", sem verbo: "hoje", "amanhã", "na segunda".
 *
 * O verbo fica de fora de propósito. Quem monta a frase sabe se está falando de
 * uma promoção ou de três, e só assim dá para escrever "volta amanhã" e
 * "voltam amanhã" corretamente — juntar tudo aqui obrigaria a uma frase só,
 * que erraria a concordância em um dos dois casos.
 */
export function nextAvailabilityLabel(
  availableWeekdays: Weekday[] | undefined,
  today: Weekday,
): string | null {
  const faltam = daysUntilNext(availableWeekdays, today);
  if (faltam === null) return null;
  if (faltam === 0) return "hoje";
  if (faltam === 1) return "amanhã";

  const proximo = availableWeekdays!.find((d) => (d - today + 7) % 7 === faltam);
  return `na ${weekdayShortName(proximo!)}`;
}
