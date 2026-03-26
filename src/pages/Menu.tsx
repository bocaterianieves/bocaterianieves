import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  items,
  isWide = false,
  onAdd
}: {
  title: string;
  items: MenuItem[];
  isWide?: boolean;
  onAdd: (name: string) => void;
}) => <div className="glass-panel rounded-3xl p-8 hover:shadow-[0_10px_40px_-10px_rgba(255,100,0,0.15)] transition-all duration-500 h-full flex flex-col">
    <h2 className="text-3xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-warm mb-8 text-center border-b border-white/10 pb-4 shrink-0">
      {title}
    </h2>
    <div className={isWide ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8 gap-x-12 flex-1" : "space-y-6 flex-1"}>
      {items.map((item, index) => <div key={index} className="flex justify-between items-start gap-4 group">
          <div className="flex-1">
            <span className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">{item.name}</span>
            {item.description && <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{item.description}</p>}
          </div>
          <div className="flex flex-col items-end gap-3 shrink-0">
            <span className="font-black text-primary text-xl whitespace-nowrap bg-primary/10 px-3 py-1 rounded-lg border border-primary/20">{item.price}</span>
            <Button size="sm" variant="outline" className="h-8 rounded-full px-3 text-xs gap-1 border-primary/30 text-primary hover:bg-primary/20 hover:text-white" onClick={() => onAdd(item.name)}>
              <Plus className="w-3 h-3" /> Añadir
            </Button>
          </div>
        </div>)}
    </div>
  </div>;
const Menu = () => {
  const { toast } = useToast();

  const handleAddToOrder = (itemName: string) => {
    const current = localStorage.getItem("bocateria_pedido") || "";
    const segments = current.split(/\s*\+\s*/).filter(Boolean);
    
    let found = false;
    const newSegments = segments.map(seg => {
      // Buscar coincidencia, teniendo cuidado si tiene "sin X, Y"
      const match = seg.match(/^x(\d+)\s+([^\s].*?)(?:\s+sin\s+.+)?$/i);
      // Solo sumamos si es exactamente el mismo sin modificaciones
      if (match && match[2].trim().toUpperCase() === itemName.toUpperCase() && !seg.toLowerCase().includes(" sin ")) {
        found = true;
        return `x${parseInt(match[1]) + 1} ${match[2]}`;
      }
      return seg;
    });

    if (!found) {
      newSegments.push(`x1 ${itemName}`);
    }

    localStorage.setItem("bocateria_pedido", newSegments.join(" + "));
    
    toast({
      title: "Añadido al pedido",
      description: `${itemName} añadido a la orden.`,
    });
  };

  return <div className="min-h-screen bg-background relative selection:bg-primary/30">
      {/* Dynamic background glow */ }
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none z-0" />
      <Header />
      
      <main className="pt-40 pb-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 animate-slide-up">
            <span className="inline-block px-4 py-2 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-semibold mb-6 tracking-wide uppercase">
              Descubre
            </span>
            <h1 className="text-6xl md:text-8xl font-serif font-extrabold text-foreground mb-6 drop-shadow-lg">
              Nuestra Carta
            </h1>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto">Elige entre nuestras deliciosas opciones, preparadas al momento con ingredientes frescos.</p>
          </div>

          <div className="space-y-8 max-w-7xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            {/* Sección Bocadillos Horizontal */}
            <div>
              <MenuSection title="Bocadillos" items={menuData.bocadillos} isWide onAdd={handleAddToOrder} />
            </div>

            {/* Resto en vertical y bien estructurado (2 columnas en PCs) con alineación perfecta */}
            <div className="grid md:grid-cols-2 gap-8">
              <MenuSection title="Hamburguesas" items={menuData.hamburguesas} onAdd={handleAddToOrder} />
              <MenuSection title="Perritos" items={menuData.perritos} onAdd={handleAddToOrder} />
              <MenuSection title="Patatas" items={menuData.patatas} onAdd={handleAddToOrder} />
              <MenuSection title="Varios" items={menuData.varios} onAdd={handleAddToOrder} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>;
};
export default Menu;