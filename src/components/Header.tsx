import { Sandwich, Clock, MapPin } from "lucide-react";
export const Header = () => {
  return <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-warm p-2 rounded-xl">
              <Sandwich className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-serif text-2xl font-bold text-foreground">Bocatería Nieves</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#inicio" className="text-muted-foreground hover:text-primary transition-colors">
              Inicio
            </a>
            <a href="#pedido" className="text-muted-foreground hover:text-primary transition-colors">
              Hacer Pedido
            </a>
            <a href="#info" className="text-muted-foreground hover:text-primary transition-colors">
              Información
            </a>
          </nav>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="hidden sm:flex items-center gap-1">
              <Clock className="w-4 h-4 text-primary" />
              <span>20:00 - 24:00</span>
            </div>
          </div>
        </div>
      </div>
    </header>;
};