import { Plus, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type MenuItem } from "@/data/menu";
import { formatCurrency } from "@/lib/format";

interface MenuItemCardProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}

export function MenuItemCard({ item, onAdd }: MenuItemCardProps) {
  return (
    <Card className="group flex flex-col overflow-hidden border border-border bg-card transition-shadow hover:shadow-md">
      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className={
            item.category === "promocoes"
              ? "w-full bg-secondary object-contain"
              : "h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          }
        />
      )}
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-card-foreground">{item.name}</h3>
              {item.badge && (
                <Badge className="bg-primary text-primary-foreground hover:bg-primary">
                  {item.badge}
                </Badge>
              )}
              {item.popular && !item.badge && (
                <Badge
                  variant="secondary"
                  className="bg-brand-subtle text-brand hover:bg-brand-subtle"
                >
                  <Flame className="mr-1 h-3 w-3" />
                  Mais pedido
                </Badge>
              )}
            </div>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3">
          <span className="text-lg font-bold text-foreground">
            {formatCurrency(item.price)}
          </span>
          <Button
            size="sm"
            onClick={() => onAdd(item)}
            className="gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Adicionar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
