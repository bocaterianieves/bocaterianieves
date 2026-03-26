import { Sandwich, Clock, Menu, X } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export const Header = () => {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "#/", scrollTo: "inicio", label: "Inicio" },
    { href: "#/", scrollTo: "pedido", label: "Pedir" },
    { href: "#/menu", label: "Menú" },
    { href: "#/", scrollTo: "info", label: "Información" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof navLinks[0]) => {
    if (link.scrollTo) {
      e.preventDefault();
      const currentHash = window.location.hash;
      const isHome = currentHash === "#/" || currentHash === "" || currentHash.startsWith("#/?");

      const scroll = () => {
        if (link.scrollTo === "inicio") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          document.getElementById(link.scrollTo!)?.scrollIntoView({ behavior: "smooth" });
        }
      };

      if (!isHome) {
        window.location.hash = "#/";
        setTimeout(scroll, 100);
      } else {
        scroll();
      }
      setOpen(false);
    }
  };

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-6xl rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all duration-300">
      <div className="px-5 py-3 md:px-8 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-warm p-2.5 rounded-xl shadow-[0_0_15px_rgba(255,100,0,0.4)]">
              <Sandwich className="w-6 h-6 text-white" />
            </div>
            <span className="font-serif text-2xl font-bold text-foreground tracking-tight drop-shadow-sm">Bocatería Nieves</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className="text-muted-foreground hover:text-primary hover:drop-shadow-[0_0_8px_rgba(255,120,0,0.6)] transition-all duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground px-4 py-1.5 rounded-full bg-white/5 border border-white/5">
              <Clock className="w-4 h-4 text-primary" />
              <span className="font-semibold text-foreground/90">20:00 - 24:00</span>
            </div>

            {/* Mobile Menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="md:hidden">
                <button className="p-2 text-foreground hover:bg-white/10 rounded-lg transition-colors">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-background/95 backdrop-blur-2xl border-l border-white/10">
                <nav className="flex flex-col gap-6 mt-12">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link)}
                      className="text-2xl font-serif font-medium text-foreground hover:text-primary transition-colors py-2 border-b border-white/5"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
                <div className="mt-12 flex items-center gap-3 text-muted-foreground bg-white/5 p-4 rounded-xl border border-white/5">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground">20:00 - 24:00</span>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};