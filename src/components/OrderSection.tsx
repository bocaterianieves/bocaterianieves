import { OrderForm } from "./OrderForm";
export const OrderSection = () => {
  return <section id="pedido" className="py-24 relative bg-background overflow-hidden">
      {/* Background glow for dark mode */ }
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <span className="inline-block px-4 py-2 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-semibold mb-6 tracking-wide uppercase">
              Haz tu pedido
            </span>
            <h2 className="font-serif text-5xl md:text-6xl font-extrabold text-foreground mb-6">
              ¿Qué te apetece hoy?
            </h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
              Cuéntanos qué bocadillo quieres y te lo preparamos con todo el cariño y los mejores ingredientes.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-12 items-start">
            {/* Features */}
            <div className="lg:col-span-2 space-y-6" style={{
            animationDelay: '0.2s'
          }}>
              <div className="group flex items-start gap-5 p-6 rounded-2xl glass-panel hover:bg-white/5 transition-colors duration-300">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-warm flex items-center justify-center shadow-warm transform group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg mb-2">Pide directamente</h3>
                  <p className="text-muted-foreground leading-relaxed">Rellena el formulario con tus bocadillos favoritos.</p>
                </div>
              </div>

              <div className="group flex items-start gap-5 p-6 rounded-2xl glass-panel hover:bg-white/5 transition-colors duration-300">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-warm flex items-center justify-center shadow-warm transform group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg mb-2">Cómodo y rápido</h3>
                  <p className="text-muted-foreground leading-relaxed">Pide sin tener que esperar colas innecesarias.</p>
                </div>
              </div>

              <div className="group flex items-start gap-5 p-6 rounded-2xl glass-panel hover:bg-white/5 transition-colors duration-300">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-warm flex items-center justify-center shadow-warm transform group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg mb-2">Pedido listo</h3>
                  <p className="text-muted-foreground leading-relaxed">Te enviaremos un email cuando tu pedido esté listo.</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3 glass-panel rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
              <div className="relative z-10">
                <OrderForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};