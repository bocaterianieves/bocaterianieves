import { OrderForm } from "./OrderForm";
export const OrderSection = () => {
  return <section id="pedido" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-slide-up">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Haz tu pedido
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              ¿Qué te apetece hoy?
            </h2>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">
              Cuéntanos qué bocadillo quieres y te lo preparamos con todo el cariño. 
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Features */}
            <div className="space-y-6" style={{
            animationDelay: '0.2s'
          }}>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-card shadow-soft">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-warm flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Rellena tu pedido</h3>
                  <p className="text-sm text-muted-foreground">Pide directamente por el formulario.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-card shadow-soft">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-warm flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Cómodo y rápido</h3>
                  <p className="text-sm text-muted-foreground">Pide sin tener que esperar.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-card shadow-soft">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-warm flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1"> Pedido listo</h3>
                  <p className="text-sm text-muted-foreground">Te enviaremos un email cuando tu pedido esté listo.</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-card rounded-2xl p-8 shadow-card animate-scale-in">
              <OrderForm />
            </div>
          </div>
        </div>
      </div>
    </section>;
};