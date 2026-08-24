import { useEffect, useState } from "react";

import { formatCep, isCompleteCep, lookupCep, onlyDigits } from "@/lib/cep";

export type Fulfillment = "retirada" | "entrega";
export type CepStatus = "idle" | "loading" | "ok" | "notfound" | "error";

/**
 * Estado do "como o cliente vai receber": retirada no balcão ou entrega.
 *
 * A consulta do CEP dispara sozinha assim que os 8 dígitos ficam completos —
 * ninguém precisa apertar botão de buscar. Nada aqui é obrigatório: se a
 * consulta falhar, ou o cliente preferir, todos os campos continuam
 * editáveis na mão.
 */
export function useDelivery() {
  const [fulfillment, setFulfillment] = useState<Fulfillment>("retirada");
  const [cep, setCepValue] = useState("");
  const [street, setStreet] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [uf, setUf] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [reference, setReference] = useState("");
  const [cepStatus, setCepStatus] = useState<CepStatus>("idle");

  const setCep = (value: string) => setCepValue(formatCep(value));

  const digits = onlyDigits(cep);

  useEffect(() => {
    if (fulfillment !== "entrega" || digits.length !== 8) {
      setCepStatus("idle");
      return;
    }

    // O AbortController cancela a consulta anterior se o cliente continuar
    // digitando. Sem isso, uma resposta velha e lenta pode chegar depois da
    // nova e sobrescrever o endereço certo pelo errado.
    const controller = new AbortController();
    setCepStatus("loading");

    void lookupCep(digits, controller.signal).then((result) => {
      if (controller.signal.aborted) return;
      setCepStatus(result.status);
      if (result.status === "ok") {
        setStreet(result.address.street);
        setNeighborhood(result.address.neighborhood);
        setCity(result.address.city);
        setUf(result.address.uf);
      }
    });

    return () => controller.abort();
  }, [digits, fulfillment]);

  const hasAnyAddress = [street, neighborhood, city, number].some((v) => v.trim() !== "");

  /**
   * Monta o bloco de endereço da mensagem do WhatsApp.
   * Só entra o que foi preenchido — nada de linha "Complemento: " vazia.
   */
  const buildAddressLines = (): string[] => {
    if (fulfillment === "retirada") return ["*Entrega:* Retirada no local"];

    if (!hasAnyAddress && !isCompleteCep(cep)) {
      return ["*Entrega:* Sim — endereço não informado, combinar pelo chat"];
    }

    // Sem rua, o número sozinho vira uma linha solta ("742") que não diz nada.
    const streetLine = street.trim()
      ? [street.trim(), number.trim()].filter(Boolean).join(", ")
      : number.trim()
        ? `Nº ${number.trim()}`
        : "";

    const cityLine = [neighborhood.trim(), [city.trim(), uf.trim()].filter(Boolean).join("/")]
      .filter(Boolean)
      .join(" — ");

    // CEP que os serviços disseram não existir não entra na mensagem: mandar
    // um CEP errado é pior do que não mandar nenhum, porque parece confiável.
    const showCep = isCompleteCep(cep) && cepStatus !== "notfound";

    return [
      "*Entrega no endereço:*",
      streetLine,
      cityLine,
      showCep ? `CEP ${formatCep(cep)}` : "",
      complement.trim() ? `Complemento: ${complement.trim()}` : "",
      reference.trim() ? `Referência: ${reference.trim()}` : "",
    ].filter(Boolean);
  };

  return {
    fulfillment,
    setFulfillment,
    cep,
    setCep,
    cepStatus,
    street,
    setStreet,
    neighborhood,
    setNeighborhood,
    city,
    setCity,
    uf,
    setUf,
    number,
    setNumber,
    complement,
    setComplement,
    reference,
    setReference,
    buildAddressLines,
  };
}

export type DeliveryState = ReturnType<typeof useDelivery>;
