import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { categories, type Category } from "@/data/menu";

interface CategoryTabsProps {
  active: Category;
  onChange: (category: Category) => void;
}

export function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  return (
    <Tabs value={active} onValueChange={(v) => onChange(v as Category)}>
      <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0">
        {categories.map((cat) => (
          <TabsTrigger
            key={cat.id}
            value={cat.id}
            className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            {cat.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
