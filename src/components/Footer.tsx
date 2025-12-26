import { MapPin, Phone, Clock, Mail } from "lucide-react";
export const Footer = () => {
  return <footer id="info" className="bg-warm-brown py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl font-bold text-primary-foreground mb-4">Bocatería Nieves</h3>
            <p className="text-primary-foreground/70 mb-4">En Bocatería Nieves, nos especializamos en los bocadillos pero también tenemos más variedad de comida como hamburguesas, perritos y patatas.</p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">Contacto</h4>
            <ul className="space-y-3 text-primary-foreground/70">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Av. Ricardo Carapeto Zambrano, 06008 Badajoz</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>+34 667 77 79 52</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>hola@labocateria.es</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-semibold text-primary-foreground mb-4">Horario</h4>
            <ul className="space-y-2 text-primary-foreground/70">
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>Lunes, Miércoles, Jueves y Viernes: 20:00 - 24:00</span>
              </li>
              <li className="flex items-center gap-2 pl-6">
                <span>Martes: Cerrado</span>
              </li>
              <li className="flex items-center gap-2 pl-6">
                <span>Sábados y Domingos: 20:00 - 24:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-8 text-center">
          <p className="text-primary-foreground/50 text-sm">© 2025 Bocatería Nieves. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>;
};