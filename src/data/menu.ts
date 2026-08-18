export type Category =
  | "sanduiches"
  | "combos"
  | "batatas"
  | "acompanhamentos"
  | "bebidas"
  | "sucos"
  | "acai-cremes";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image?: string;
  popular?: boolean;
}

export const categories: { id: Category; label: string }[] = [
  { id: "sanduiches", label: "Sanduíches" },
  { id: "combos", label: "Combos" },
  { id: "batatas", label: "Batatas" },
  { id: "acompanhamentos", label: "Acompanhamentos" },
  { id: "bebidas", label: "Bebidas" },
  { id: "sucos", label: "Sucos" },
  { id: "acai-cremes", label: "Açaí e Cremes" },
];

export const menuItems: MenuItem[] = [
  // Sanduíches
  {
    id: "xbacon",
    name: "X-Bacon",
    description: "Hambúrguer, bacon crocante, queijo, alface, tomate e molho especial.",
    price: 24.9,
    category: "sanduiches",
    popular: true,
  },
  {
    id: "xsalada",
    name: "X-Salada",
    description: "Hambúrguer, queijo, alface, tomate, cebola e maionese caseira.",
    price: 21.9,
    category: "sanduiches",
  },
  {
    id: "xtudo",
    name: "X-Tudo",
    description: "Hambúrguer, bacon, ovo, presunto, queijo, calabresa, alface e tomate.",
    price: 29.9,
    category: "sanduiches",
    popular: true,
  },
  {
    id: "xfrango",
    name: "X-Frango",
    description: "Filé de peito de frango grelhado, queijo, alface, tomate e molho verde.",
    price: 23.9,
    category: "sanduiches",
  },
  {
    id: "burguer-duplo",
    name: "PapaLéguas Duplo",
    description: "Dois hambúrgueres, duplo queijo, cebola caramelizada e molho barbecue.",
    price: 32.9,
    category: "sanduiches",
    popular: true,
  },

  // Combos
  {
    id: "combo-papaleguas",
    name: "Combo PapaLéguas",
    description: "X-Bacon + batata frita média + refrigerante 350ml.",
    price: 38.9,
    category: "combos",
    popular: true,
  },
  {
    id: "combo-duplo",
    name: "Combo Duplo",
    description: "PapaLéguas Duplo + batata frita grande + 2 refrigerantes.",
    price: 52.9,
    category: "combos",
  },
  {
    id: "combo-frango",
    name: "Combo Frango",
    description: "X-Frango + batata frita média + suco natural.",
    price: 35.9,
    category: "combos",
  },

  // Batatas
  {
    id: "batata-p",
    name: "Batata Frita P",
    description: "Porção individual de batatas fritas crocantes.",
    price: 12.9,
    category: "batatas",
  },
  {
    id: "batata-m",
    name: "Batata Frita M",
    description: "Porção média, ideal para dividir.",
    price: 18.9,
    category: "batatas",
  },
  {
    id: "batata-g",
    name: "Batata Frita G",
    description: "Porção grande com cheddar e bacon.",
    price: 26.9,
    category: "batatas",
    popular: true,
  },

  // Acompanhamentos
  {
    id: "nuggets-8",
    name: "Nuggets (8 unidades)",
    description: "Nuggets de frango empanados com molho barbecue.",
    price: 16.9,
    category: "acompanhamentos",
  },
  {
    id: "onion-rings",
    name: "Anéis de Cebola",
    description: "Porção de anéis de cebola empanados e crocantes.",
    price: 17.9,
    category: "acompanhamentos",
  },

  // Bebidas
  {
    id: "refri-lata",
    name: "Refrigerante Lata",
    description: "Coca-Cola, Guaraná, Fanta ou Sprite 350ml.",
    price: 6.5,
    category: "bebidas",
  },
  {
    id: "refri-1l",
    name: "Refrigerante 1L",
    description: "Coca-Cola, Guaraná ou Fanta 1 litro.",
    price: 10.9,
    category: "bebidas",
  },
  {
    id: "agua",
    name: "Água Mineral",
    description: "Água mineral sem ou com gás 500ml.",
    price: 4.5,
    category: "bebidas",
  },

  // Sucos
  {
    id: "suco-laranja",
    name: "Suco de Laranja",
    description: "Suco natural de laranja 400ml.",
    price: 9.9,
    category: "sucos",
  },
  {
    id: "suco-acerola",
    name: "Suco de Acerola",
    description: "Suco natural de acerola 400ml.",
    price: 9.9,
    category: "sucos",
  },
  {
    id: "suco-maracuja",
    name: "Suco de Maracujá",
    description: "Suco natural de maracujá 400ml.",
    price: 9.9,
    category: "sucos",
  },

  // Açaí e Cremes
  {
    id: "acai-300",
    name: "Açaí 300ml",
    description: "Açaí na tigela com granola e banana.",
    price: 14.9,
    category: "acai-cremes",
  },
  {
    id: "acai-500",
    name: "Açaí 500ml",
    description: "Açaí na tigela com granola, banana, leite em pó e leite condensado.",
    price: 19.9,
    category: "acai-cremes",
    popular: true,
  },
  {
    id: "creme-papaya",
    name: "Creme de Papaya",
    description: "Creme de papaya com cassis 400ml.",
    price: 12.9,
    category: "acai-cremes",
  },
];
