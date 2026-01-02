import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { OrderAutocomplete } from "@/components/OrderAutocomplete";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { cn } from "@/lib/utils";

const orderSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio").max(100, "El nombre es demasiado largo"),
  correo: z.string().trim().email("Por favor, introduce un correo válido").max(255, "El correo es demasiado largo"),
  pedido: z.string().trim().min(1, "El pedido es obligatorio").max(1000, "El pedido es demasiado largo"),
  tipoPedido: z.enum(["comer", "llevar"], { required_error: "Selecciona una opción" }),
  fechaRecogida: z.date({ required_error: "La fecha de recogida es obligatoria" }),
  horaRecogida: z.string().min(1, "La hora de recogida es obligatoria"),
});

type OrderFormData = z.infer<typeof orderSchema>;

const horasDisponibles = [
  "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"
];

// Deshabilitar martes (día 2 en JavaScript, donde 0 = domingo)
const isTuesday = (date: Date) => date.getDay() === 2;

export const OrderForm = () => {
  const [formData, setFormData] = useState<Partial<OrderFormData>>({
    nombre: "",
    correo: "",
    pedido: "",
    tipoPedido: undefined,
    horaRecogida: "",
  });
  const [fechaRecogida, setFechaRecogida] = useState<Date | undefined>();
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

    const dataToValidate = {
      ...formData,
      fechaRecogida,
    };

    const result = orderSchema.safeParse(dataToValidate);
    
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
          tipoPedido: result.data.tipoPedido,
          fechaRecogida: format(result.data.fechaRecogida, "yyyy-MM-dd"),
          horaRecogida: result.data.horaRecogida,
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

      setFormData({ nombre: "", correo: "", pedido: "", tipoPedido: undefined, horaRecogida: "" });
      setFechaRecogida(undefined);
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
          Nombre <span className="text-orange-500">*</span>
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
          Correo electrónico <span className="text-orange-500">*</span>
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
          Tu pedido <span className="text-orange-500">*</span>
        </label>
        <OrderAutocomplete
          id="pedido"
          name="pedido"
          placeholder="Escribe tu pedido..."
          value={formData.pedido || ""}
          onChange={(value) => {
            setFormData((prev) => ({ ...prev, pedido: value }));
            if (errors.pedido) {
              setErrors((prev) => ({ ...prev, pedido: undefined }));
            }
          }}
        />
        {errors.pedido && (
          <p id="pedido-error" className="text-sm text-destructive">
            {errors.pedido}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-foreground">
          ¿Para comer o para llevar? <span className="text-orange-500">*</span>
        </label>
        <RadioGroup
          value={formData.tipoPedido}
          onValueChange={(value: "comer" | "llevar") => {
            setFormData((prev) => ({ ...prev, tipoPedido: value }));
            if (errors.tipoPedido) {
              setErrors((prev) => ({ ...prev, tipoPedido: undefined }));
            }
          }}
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="comer" id="comer" />
            <label htmlFor="comer" className="text-sm font-medium cursor-pointer">
              Para comer aquí
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="llevar" id="llevar" />
            <label htmlFor="llevar" className="text-sm font-medium cursor-pointer">
              Para llevar
            </label>
          </div>
        </RadioGroup>
        {errors.tipoPedido && (
          <p className="text-sm text-destructive">{errors.tipoPedido}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Fecha de recogida <span className="text-orange-500">*</span>
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !fechaRecogida && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {fechaRecogida ? format(fechaRecogida, "PPP", { locale: es }) : <span>Selecciona fecha</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={fechaRecogida}
                onSelect={(date) => {
                  setFechaRecogida(date);
                  if (errors.fechaRecogida) {
                    setErrors((prev) => ({ ...prev, fechaRecogida: undefined }));
                  }
                }}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0)) || isTuesday(date)}
                initialFocus
                className="p-3 pointer-events-auto"
                locale={es}
              />
            </PopoverContent>
          </Popover>
          {errors.fechaRecogida && (
            <p className="text-sm text-destructive">{errors.fechaRecogida}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Hora de recogida <span className="text-orange-500">*</span>
          </label>
          <Select
            value={formData.horaRecogida}
            onValueChange={(value) => {
              setFormData((prev) => ({ ...prev, horaRecogida: value }));
              if (errors.horaRecogida) {
                setErrors((prev) => ({ ...prev, horaRecogida: undefined }));
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona hora" />
            </SelectTrigger>
            <SelectContent>
              {horasDisponibles.map((hora) => (
                <SelectItem key={hora} value={hora}>
                  {hora}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.horaRecogida && (
            <p className="text-sm text-destructive">{errors.horaRecogida}</p>
          )}
        </div>
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
