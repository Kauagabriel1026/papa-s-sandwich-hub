/**
 * Consulta de CEP.
 *
 * Usa dois serviços públicos e gratuitos, sem cadastro e sem chave:
 *   1. BrasilAPI  — ela própria consulta vários provedores por dentro
 *   2. ViaCEP     — o clássico, usado como reserva
 *
 * Se o primeiro falhar (fora do ar, CEP não encontrado, internet lenta), tenta
 * o segundo. Um só serviço seria um ponto único de falha bem no meio do pedido.
 *
 * Os dois devolvem campos com nomes diferentes, então normalizamos para um
 * formato único antes de entregar pra tela. E validamos o resultado: se vier
 * sem cidade ou sem UF, tratamos como "não encontrado" em vez de preencher o
 * formulário com metade da informação.
 */

export interface Address {
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  uf: string;
}

/** Quanto tempo esperar cada serviço antes de desistir e tentar o próximo. */
const TIMEOUT_MS = 6000;

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** "74663520" -> "74663-520". Enquanto o usuário digita, mostra o que já tem. */
export function formatCep(value: string): string {
  const digits = onlyDigits(value).slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function isCompleteCep(value: string): boolean {
  return onlyDigits(value).length === 8;
}

function isFilled(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

/**
 * Aceita o formato dos dois serviços e devolve null se a resposta não tiver o
 * mínimo utilizável (cidade e UF).
 */
function normalize(raw: unknown, cep: string): Address | null {
  if (typeof raw !== "object" || raw === null) return null;
  const data = raw as Record<string, unknown>;

  // ViaCEP marca CEP inexistente com { erro: true } e status 200.
  if (data["erro"] === true || data["erro"] === "true") return null;

  const city = data["city"] ?? data["localidade"];
  const uf = data["state"] ?? data["uf"];
  const street = data["street"] ?? data["logradouro"];
  const neighborhood = data["neighborhood"] ?? data["bairro"];

  if (!isFilled(city) || !isFilled(uf)) return null;

  return {
    cep: formatCep(cep),
    street: isFilled(street) ? street.trim() : "",
    neighborhood: isFilled(neighborhood) ? neighborhood.trim() : "",
    city: city.trim(),
    uf: uf.trim().toUpperCase(),
  };
}

async function fetchJson(url: string, signal?: AbortSignal): Promise<unknown | null> {
  // Um timeout próprio por serviço: sem isso, um provedor lento trava a
  // consulta inteira e o cliente fica olhando pro campo girando.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const onAbort = () => controller.abort();
  signal?.addEventListener("abort", onAbort);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) return null;
    return (await response.json()) as unknown;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}

export type CepResult =
  { status: "ok"; address: Address } | { status: "notfound" } | { status: "error" };

/**
 * Procura o endereço de um CEP.
 *
 * - "ok"       -> achou, com o endereço normalizado
 * - "notfound" -> os serviços responderam, mas o CEP não existe
 * - "error"    -> nenhum serviço respondeu (sem internet, ambos fora do ar)
 *
 * A diferença entre "notfound" e "error" existe para a tela poder dizer a
 * coisa certa: "CEP não encontrado" é problema do que foi digitado;
 * "não deu para consultar" é problema da conexão, e aí o cliente deve poder
 * preencher o endereço na mão em vez de ficar travado.
 */
export async function lookupCep(cep: string, signal?: AbortSignal): Promise<CepResult> {
  const digits = onlyDigits(cep);
  if (digits.length !== 8) return { status: "notfound" };

  const providers = [
    `https://brasilapi.com.br/api/cep/v1/${digits}`,
    `https://viacep.com.br/ws/${digits}/json/`,
  ];

  let anyResponded = false;

  for (const url of providers) {
    if (signal?.aborted) return { status: "error" };

    const raw = await fetchJson(url, signal);
    if (raw === null) continue;

    anyResponded = true;
    const address = normalize(raw, digits);
    if (address) return { status: "ok", address };
  }

  // Alguém respondeu, mas nenhum reconheceu o CEP: ele realmente não existe.
  // Ninguém respondeu: é falha de conexão, e a tela deve dizer isso.
  return anyResponded ? { status: "notfound" } : { status: "error" };
}
