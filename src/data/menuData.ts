export interface MenuItem {
  name: string;
  description: string;
  price: string;
  category: string;
}

export const menuData: MenuItem[] = [
  // Bocadillos
  { name: "SERRANITO", description: "Lomo, pimiento, tomate, tortilla y jamón serrano", price: "5,50€", category: "Bocadillos" },
  { name: "ADOBAO", description: "Lomo adobado, tomate, queso y bacon", price: "5,50€", category: "Bocadillos" },
  { name: "CALAMARES", description: "Calamares", price: "5,50€", category: "Bocadillos" },
  { name: "PLUMAS", description: "Pollo, pimiento, tomate y tortilla", price: "5,50€", category: "Bocadillos" },
  { name: "PICANTÓN", description: "Lomo o pollo, jamón serrano, 2 huevos, tomate y salsa brava", price: "5,50€", category: "Bocadillos" },
  { name: "CASA", description: "Pollo empanado, queso, jamón york y pimiento", price: "5,50€", category: "Bocadillos" },
  { name: "TORTILLA", description: "Tortilla de jamón york, queso, pimiento, tomate y cebolla", price: "5,00€", category: "Bocadillos" },
  { name: "VEGETAL", description: "Lechuga, tomate, cebolla, espárragos, palitos de mar, huevo duro y atún", price: "5,00€", category: "Bocadillos" },
  { name: "BACON", description: "Bacon y queso", price: "4,50€", category: "Bocadillos" },
  { name: "POLLO", description: "Pollo y queso", price: "4,50€", category: "Bocadillos" },
  { name: "BURGUER", description: "Doble hamburguesa y queso", price: "4,50€", category: "Bocadillos" },
  { name: "MONTADO", description: "Lomo o pollo y tomate", price: "4,50€", category: "Bocadillos" },
  { name: "KINI", description: "Cebolla frita, bacon, jamón serrano, 2 huevos, jamón york plancha, patatas paja y queso", price: "5,50€", category: "Bocadillos" },
  { name: "SANDWICH MIXTO", description: "", price: "3,50€", category: "Bocadillos" },
  { name: "TORTILLA FRANCESA", description: "", price: "2,50€", category: "Bocadillos" },
  { name: "AL GUSTO", description: "Carne a elegir, verdura lo que gustes y salsa a elegir", price: "3,00€", category: "Bocadillos" },
  // Hamburguesas
  { name: "HAMBURGUESA CLÁSICA", description: "Carne, lechuga, tomate, cebolla, queso y jamón york", price: "4,50€", category: "Hamburguesas" },
  { name: "HAMBURGUESA NORMAL", description: "Carne, lechuga, tomate, cebolla, queso, jamón york, bacon y huevo", price: "5,00€", category: "Hamburguesas" },
  { name: "HAMBURGUESA GRANDE", description: "Doble carne, lechuga, tomate, cebolla, queso, jamón york, bacon, huevo y patatas paja", price: "5,50€", category: "Hamburguesas" },
  // Perritos
  { name: "PERRITO CLÁSICO", description: "Con nuestro perrito de siempre", price: "1,50€", category: "Perritos" },
  { name: "PERRITO CALIFORNIA", description: "Salchicha gigante, patatas paja y salsa a elegir", price: "3,50€", category: "Perritos" },
  { name: "PERRITO FLORIDA", description: "Salchicha gigante, bacon y salsa a elegir", price: "3,50€", category: "Perritos" },
  { name: "PERRITO CHICAGO", description: "Salchicha gigante, bacon, queso, patatas paja, lechuga, tomate, pepinillo y salsa a elegir", price: "4,00€", category: "Perritos" },
  // Patatas
  { name: "PATATAS CLÁSICA", description: "Nuestras patatas de siempre con salsa a elegir", price: "3,00€", category: "Patatas" },
  { name: "PATATAS AL GUSTO", description: "Con bacon y queso o empanados o jamón york y queso y lomo adobado", price: "5,00€", category: "Patatas" },
  // Varios
  { name: "RACIÓN DE CALAMARES", description: "", price: "6,50€", category: "Varios" },
  { name: "ENSALADA MIXTA", description: "Ensalada mixta", price: "4,50€", category: "Varios" },
  { name: "ENSALADA MIXTA CON POLLO", description: "Ensalada mixta con pollo", price: "5,00€", category: "Varios" },
];

// Extraer ingredientes únicos de todas las descripciones
export const extractIngredients = (description: string): string[] => {
  if (!description) return [];
  return description
    .split(/,\s*|y\s+/)
    .map(ing => ing.trim().toLowerCase())
    .filter(ing => ing.length > 0);
};

export const getAllIngredients = (): string[] => {
  const ingredientsSet = new Set<string>();
  menuData.forEach(item => {
    extractIngredients(item.description).forEach(ing => ingredientsSet.add(ing));
  });
  return Array.from(ingredientsSet).sort();
};
