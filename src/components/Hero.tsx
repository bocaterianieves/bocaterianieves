import heroBg from "@/assets/hero-bocadillo.jpg";
export const Hero = () => {
  return <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src={heroBg} alt="Deliciosos bocadillos artesanales" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-hero opacity-70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto animate-fade-in">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/20 text-primary-foreground text-sm font-medium mb-6 backdrop-blur-sm border border-primary/30">
            Bocadillos Artesanales
          </span>
          
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-primary-foreground mb-6 leading-tight">Bocatería
Enamora<br />
            <span className="text-gradient">Enamora</span>
          </h1>
          
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-xl mx-auto">
            Ingredientes frescos, recetas tradicionales y el cariño de siempre. 
            Haz tu pedido y disfruta del mejor bocadillo de la ciudad.
          </p>
          
          <a href="#pedido" className="inline-flex items-center gap-2 bg-gradient-warm text-primary-foreground px-8 py-4 rounded-xl font-semibold text-lg shadow-warm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            Hacer Pedido
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </div>

      {/* Decorative wave */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" className="fill-background" />
        </svg>
      </div>
    </section>;
};