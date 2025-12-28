import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
const menuData = {
  bocadillos: [{
    name: "SERRANITO",
    description: "Lomo, pimiento, tomate, tortilla y jamón serrano",
    price: "5,50€"
  }, {
    name: "ADOBAO",
    description: "Lomo adobado, tomate, queso y bacon",
    price: "5,50€"
  }, {
    name: "CALAMARES",
    description: "Calamares",
    price: "5,50€"
  }, {
    name: "PLUMAS",
    description: "Pollo, pimiento, tomate y tortilla",
    price: "5,50€"
  }, {
    name: "PICANTÓN",
    description: "Lomo o pollo, jamón serrano, 2 huevos, tomate y salsa brava",
    price: "5,50€"
  }, {
    name: "CASA",
    description: "Pollo empanado, queso, jamón york y pimiento",
    price: "5,50€"
  }, {
    name: "TORTILLA",
    description: "Tortilla de jamón york, queso, pimiento, tomate y cebolla",
    price: "5,00€"
  }, {
    name: "VEGETAL",
    description: "Lechuga, tomate, cebolla, espárragos, palitos de mar, huevo duro y atún",
    price: "5,00€"
  }, {
    name: "BACON",
    description: "Bacon y queso",
    price: "4,50€"
  }, {
    name: "POLLO",
    description: "Pollo y queso",
    price: "4,50€"
  }, {
    name: "BURGUER",
    description: "Doble hamburguesa y queso",
    price: "4,50€"
  }, {
    name: "MONTADO",
    description: "Lomo o pollo y tomate",
    price: "4,50€"
  }, {
    name: "KINI",
    description: "Cebolla frita, bacon, jamón serrano, 2 huevos, jamón york plancha, patatas paja y queso",
    price: "5,50€"
  }, {
    name: "SANDWICH MIXTO",
    description: "",
    price: "3,50€"
  }, {
    name: "TORTILLA FRANCESA",
    description: "",
    price: "2,50€"
  }, {
    name: "AL GUSTO",
    description: "Carne a elegir, verdura lo que gustes y salsa a elegir",
    price: "3,00€"
  }],
  hamburguesas: [{
    name: "CLÁSICA",
    description: "Carne, lechuga, tomate, cebolla, queso y jamón york",
    price: "4,50€"
  }, {
    name: "NORMAL",
    description: "Carne, lechuga, tomate, cebolla, queso, jamón york, bacon y huevo",
    price: "5,00€"
  }, {
    name: "GRANDE",
    description: "Doble carne, lechuga, tomate, cebolla, queso, jamón york, bacon, huevo y patatas paja",
    price: "5,50€"
  }],
  perritos: [{
    name: "CLÁSICO",
    description: "Con nuestro perrito de siempre",
    price: "1,50€"
  }, {
    name: "CALIFORNIA",
    description: "Salchicha gigante, patatas paja y salsa a elegir",
    price: "3,50€"
  }, {
    name: "FLORIDA",
    description: "Salchicha gigante, bacon y salsa a elegir",
    price: "3,50€"
  }, {
    name: "CHICAGO",
    description: "Salchicha gigante, bacon, queso, patatas paja, lechuga, tomate, pepinillo y salsa a elegir",
    price: "4,00€"
  }],
  patatas: [{
    name: "CLÁSICA",
    description: "Nuestras patatas de siempre con salsa a elegir",
    price: "3,00€"
  }, {
    name: "AL GUSTO",
    description: "Con bacon y queso o empanados o jamón york y queso y lomo adobado",
    price: "5,00€"
  }],
  varios: [{
    name: "RACIÓN DE CALAMARES",
    description: "",
    price: "6,50€"
  }, {
    name: "ENSALADA MIXTA",
    description: "",
    price: "4,50€"
  }, {
    name: "ENSALADA MIXTA CON POLLO",
    description: "",
    price: "5,00€"
  }]
};
type MenuItem = {
  name: string;
  description: string;
  price: string;
};
const MenuSection = ({
  title,
  items
}: {
  title: string;
  items: MenuItem[];
}) => <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
    <h2 className="text-2xl font-serif font-bold text-primary mb-4 text-center border-b border-border pb-3">
      {title}
    </h2>
    <div className="space-y-3">
      {items.map((item, index) => <div key={index} className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <span className="font-semibold text-foreground">{item.name}</span>
            {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
          </div>
          <span className="font-bold text-primary whitespace-nowrap">{item.price}</span>
        </div>)}
    </div>
  </div>;
const Menu = () => {
  return <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Nuestra Carta
            </h1>
            <p className="text-muted-foreground text-lg">Esto es todo lo que tenemos en nuestra carta. </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <MenuSection title="Bocadillos" items={menuData.bocadillos} />
            <MenuSection title="Hamburguesas" items={menuData.hamburguesas} />
            <MenuSection title="Perritos" items={menuData.perritos} />
            <MenuSection title="Patatas" items={menuData.patatas} />
            <MenuSection title="Varios" items={menuData.varios} />
          </div>
        </div>
      </main>

      <Footer />
    </div>;
};
export default Menu;