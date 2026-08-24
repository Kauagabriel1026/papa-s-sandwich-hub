import { Bike, Loader2, MapPin, Store } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isCompleteCep } from "@/lib/cep";
import type { DeliveryState } from "@/hooks/use-delivery";

interface DeliveryFieldsProps {
  delivery: DeliveryState;
}

/** Mensagem abaixo do CEP. Separa "digitou errado" de "não deu pra consultar". */
function CepHint({ status }: { status: DeliveryState["cepStatus"] }) {
  if (status === "loading") {
    return (
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" />
        Buscando endereço...
      </p>
    );
  }
  if (status === "ok") {
    return <p className="text-xs font-medium text-brand">Endereço encontrado. Confira abaixo.</p>;
  }
  if (status === "notfound") {
    return (
      <p className="text-xs font-medium text-destructive">
        CEP não encontrado. Confira os números ou preencha o endereço à mão.
      </p>
    );
  }
  if (status === "error") {
    return (
      <p className="text-xs text-muted-foreground">
        Não deu para consultar agora. Pode preencher o endereço à mão.
      </p>
    );
  }
  return (
    <p className="text-xs text-muted-foreground">
      Opcional — preenche rua, bairro e cidade sozinho.
    </p>
  );
}

export function DeliveryFields({ delivery }: DeliveryFieldsProps) {
  const {
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
  } = delivery;

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Como prefere receber?</Label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setFulfillment("retirada")}
            aria-pressed={fulfillment === "retirada"}
            className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-medium transition-colors ${
              fulfillment === "retirada"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:bg-accent"
            }`}
          >
            <Store className="h-4 w-4" />
            Retirar no local
          </button>
          <button
            type="button"
            onClick={() => setFulfillment("entrega")}
            aria-pressed={fulfillment === "entrega"}
            className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-medium transition-colors ${
              fulfillment === "entrega"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:bg-accent"
            }`}
          >
            <Bike className="h-4 w-4" />
            Entrega
          </button>
        </div>
      </div>

      {fulfillment === "entrega" && (
        <div className="space-y-3 rounded-xl border border-border bg-secondary/40 p-3">
          <div className="space-y-1.5">
            <Label htmlFor="cep" className="flex items-center gap-1.5 text-sm font-medium">
              <MapPin className="h-3.5 w-3.5" /> CEP
            </Label>
            <Input
              id="cep"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              placeholder="00000-000"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={9}
              aria-invalid={cepStatus === "notfound"}
              aria-busy={cepStatus === "loading"}
            />
            <CepHint status={cepStatus} />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="street" className="text-sm font-medium">
                Rua
              </Label>
              <Input
                id="street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Nome da rua"
                autoComplete="address-line1"
                maxLength={120}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="number" className="text-sm font-medium">
                Número
              </Label>
              <Input
                id="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="123"
                inputMode="numeric"
                maxLength={10}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="neighborhood" className="text-sm font-medium">
              Bairro
            </Label>
            <Input
              id="neighborhood"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              placeholder="Bairro"
              maxLength={80}
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-3 space-y-1.5">
              <Label htmlFor="city" className="text-sm font-medium">
                Cidade
              </Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Cidade"
                maxLength={80}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="uf" className="text-sm font-medium">
                UF
              </Label>
              <Input
                id="uf"
                value={uf}
                onChange={(e) => setUf(e.target.value.toUpperCase().slice(0, 2))}
                placeholder="GO"
                maxLength={2}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="complement" className="text-sm font-medium">
              Complemento <span className="font-normal text-muted-foreground">(opcional)</span>
            </Label>
            <Input
              id="complement"
              value={complement}
              onChange={(e) => setComplement(e.target.value)}
              placeholder="Apto, bloco, casa dos fundos..."
              maxLength={60}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reference" className="text-sm font-medium">
              Ponto de referência{" "}
              <span className="font-normal text-muted-foreground">(opcional)</span>
            </Label>
            <Input
              id="reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Perto da praça, portão azul..."
              maxLength={80}
            />
            {isCompleteCep(cep) && !number.trim() && (
              <p className="text-xs font-medium text-destructive">
                Falta o número da casa — sem ele o entregador não acha o endereço.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
