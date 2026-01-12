import { useMemo } from "react";
import { Plus, Minus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { menuData, MenuItem } from "@/data/menuData";

interface DetectedProduct {
  item: MenuItem;
  quantity: number;
}

interface OrderProductListProps {
  pedido: string;
  onUpdatePedido: (newPedido: string) => void;
}

export const OrderProductList = ({ pedido, onUpdatePedido }: OrderProductListProps) => {
  // Detectar productos y sus cantidades del texto del pedido (formato: x2 PRODUCTO)
  const detectedProducts = useMemo((): DetectedProduct[] => {
    if (!pedido.trim()) return [];
    
    const products: DetectedProduct[] = [];
    
    // Separar por " + "
    const segments = pedido.split(/\s*\+\s*/);
    
    segments.forEach((segment) => {
      const trimmed = segment.trim();
      if (!trimmed) return;
      
      // Buscar formato "xN PRODUCTO" o solo "PRODUCTO"
      const quantityMatch = trimmed.match(/^x(\d+)\s+/i);
      const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 1;
      const productPart = quantityMatch ? trimmed.replace(/^x\d+\s+/i, '') : trimmed;
      
      // Buscar el producto en el menú
      const foundItem = menuData.find(item => 
        productPart.toUpperCase().includes(item.name.toUpperCase())
      );
      
      if (foundItem) {
        // Verificar si ya existe este producto
        const existing = products.find(p => p.item.name === foundItem.name);
        if (existing) {
          existing.quantity += quantity;
        } else {
          products.push({ item: foundItem, quantity });
        }
      }
    });
    
    return products;
  }, [pedido]);

  const updateQuantity = (product: MenuItem, delta: number) => {
    const currentProduct = detectedProducts.find(p => p.item.name === product.name);
    const currentQuantity = currentProduct?.quantity || 0;
    const newQuantity = Math.max(0, currentQuantity + delta);
    
    // Separar el pedido por " + "
    const segments = pedido.split(/\s*\+\s*/);
    let found = false;
    
    const newSegments = segments.map((segment) => {
      const trimmed = segment.trim();
      if (!trimmed) return null;
      
      // Verificar si este segmento contiene el producto
      if (trimmed.toUpperCase().includes(product.name.toUpperCase())) {
        found = true;
        if (newQuantity === 0) {
          return null; // Eliminar
        }
        // Extraer cualquier modificador "sin X"
        const sinMatch = trimmed.match(/\s+(sin\s+.*)$/i);
        const modifier = sinMatch ? sinMatch[1] : '';
        
        if (newQuantity === 1) {
          return modifier ? `${product.name} ${modifier}` : product.name;
        } else {
          return modifier ? `x${newQuantity} ${product.name} ${modifier}` : `x${newQuantity} ${product.name}`;
        }
      }
      return segment;
    }).filter(Boolean);
    
    // Si no se encontró y estamos añadiendo, agregar nuevo
    if (!found && delta > 0) {
      newSegments.push(product.name);
    }
    
    onUpdatePedido(newSegments.join(' + '));
  };

  if (detectedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 space-y-2">
      <p className="text-xs text-muted-foreground font-medium">Productos detectados:</p>
      <div className="space-y-2">
        {detectedProducts.map((product) => {
          const price = parseFloat(product.item.price.replace('€', '').replace(',', '.'));
          const subtotal = price * product.quantity;
          
          return (
            <div
              key={product.item.name}
              className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2 gap-2"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{product.item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {product.item.price} × {product.quantity} = {subtotal.toFixed(2).replace('.', ',')}€
                </p>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => updateQuantity(product.item, -1)}
                >
                  {product.quantity === 1 ? (
                    <X className="h-3 w-3" />
                  ) : (
                    <Minus className="h-3 w-3" />
                  )}
                </Button>
                
                <span className="w-8 text-center font-bold text-sm">
                  x{product.quantity}
                </span>
                
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => updateQuantity(product.item, 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
