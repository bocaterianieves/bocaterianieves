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
  // Detectar productos y sus cantidades del texto del pedido
  const detectedProducts = useMemo((): DetectedProduct[] => {
    if (!pedido.trim()) return [];
    
    const pedidoUpper = pedido.toUpperCase();
    const products: DetectedProduct[] = [];
    
    menuData.forEach((item) => {
      const itemNameUpper = item.name.toUpperCase();
      const regex = new RegExp(itemNameUpper.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = pedidoUpper.match(regex);
      if (matches) {
        products.push({
          item,
          quantity: matches.length,
        });
      }
    });
    
    return products;
  }, [pedido]);

  const updateQuantity = (product: MenuItem, delta: number) => {
    const currentQuantity = detectedProducts.find(p => p.item.name === product.name)?.quantity || 0;
    const newQuantity = Math.max(0, currentQuantity + delta);
    
    // Construir el nuevo pedido
    let newPedido = pedido;
    const productNameUpper = product.name.toUpperCase();
    const pedidoUpper = pedido.toUpperCase();
    
    if (newQuantity === 0) {
      // Eliminar todas las instancias del producto
      const regex = new RegExp(`,?\\s*${product.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s+sin\\s+[^,]*)?`, 'gi');
      newPedido = pedido.replace(regex, '').replace(/^,\s*/, '').replace(/,\s*$/, '').replace(/,\s*,/g, ',').trim();
    } else if (delta > 0) {
      // Añadir una instancia más
      if (pedido.trim()) {
        newPedido = pedido + ", " + product.name;
      } else {
        newPedido = product.name;
      }
    } else if (delta < 0) {
      // Quitar una instancia (la primera que encuentre)
      const index = pedidoUpper.indexOf(productNameUpper);
      if (index !== -1) {
        // Buscar desde el inicio hasta después del producto para eliminar comas extra
        const before = pedido.substring(0, index);
        const after = pedido.substring(index + product.name.length);
        
        // Limpiar comas y espacios extra
        let cleanedAfter = after.replace(/^\s*,\s*/, '').replace(/^\s+/, '');
        let cleanedBefore = before.replace(/,\s*$/, '').replace(/\s+$/, '');
        
        if (cleanedBefore && cleanedAfter) {
          newPedido = cleanedBefore + ", " + cleanedAfter;
        } else {
          newPedido = cleanedBefore + cleanedAfter;
        }
      }
    }
    
    onUpdatePedido(newPedido.trim());
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
