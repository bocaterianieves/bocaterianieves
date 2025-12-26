import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const orderSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio").max(100, "El nombre es demasiado largo"),
  correo: z.string().trim().email("Por favor, introduce un correo válido").max(255, "El correo es demasiado largo"),
  pedido: z.string().trim().min(1, "El pedido es obligatorio").max(1000, "El pedido es demasiado largo"),
});

type OrderFormData = z.infer<typeof orderSchema>;

export const OrderForm = () => {
  const [formData, setFormData] = useState<OrderFormData>({
    nombre: "",
    correo: "",
    pedido: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof OrderFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof OrderFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = orderSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof OrderFormData, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof OrderFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-order", {
        body: {
          nombre: result.data.nombre,
          correo: result.data.correo,
          pedido: result.data.pedido,
          timestamp: new Date().toISOString(),
        },
      });

      if (error) {
        throw error;
      }

      if (!data?.success) {
        throw new Error(data?.error || "El backend devolvió un error");
      }

      toast({
        title: "¡Pedido enviado!",
        description: "Hemos recibido tu pedido. Te contactaremos pronto.",
      });

      setFormData({ nombre: "", correo: "", pedido: "" });
    } catch (error) {
      console.error("Error enviando el pedido:", error);
      toast({
        title: "Error",
        description: "No se pudo enviar el pedido. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="nombre" className="block text-sm font-medium text-foreground">
          Nombre
        </label>
        <Input
          id="nombre"
          name="nombre"
          type="text"
          placeholder="Tu nombre"
          value={formData.nombre}
          onChange={handleChange}
          aria-describedby={errors.nombre ? "nombre-error" : undefined}
        />
        {errors.nombre && (
          <p id="nombre-error" className="text-sm text-destructive">
            {errors.nombre}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="correo" className="block text-sm font-medium text-foreground">
          Correo electrónico
        </label>
        <Input
          id="correo"
          name="correo"
          type="email"
          placeholder="tu@email.com"
          value={formData.correo}
          onChange={handleChange}
          aria-describedby={errors.correo ? "correo-error" : undefined}
        />
        {errors.correo && (
          <p id="correo-error" className="text-sm text-destructive">
            {errors.correo}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="pedido" className="block text-sm font-medium text-foreground">
          Tu pedido
        </label>
        <Textarea
          id="pedido"
          name="pedido"
          placeholder="Describe tu bocadillo perfecto... (ej: Bocadillo de jamón serrano con tomate y aceite)"
          value={formData.pedido}
          onChange={handleChange}
          aria-describedby={errors.pedido ? "pedido-error" : undefined}
        />
        {errors.pedido && (
          <p id="pedido-error" className="text-sm text-destructive">
            {errors.pedido}
          </p>
        )}
      </div>

      <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Enviando...
          </span>
        ) : (
          "Enviar Pedido"
        )}
      </Button>
    </form>
  );
};
