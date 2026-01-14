import { useMemo, useState } from "react";
import { Plus, Minus, X, Settings2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { menuData, MenuItem, extractIngredients } from "@/data/menuData";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

interface DetectedProduct {
  item: MenuItem;
  quantity: number;
  excludedIngredients: string[];
  originalSegment: string;
}

interface OrderProductListProps {
  pedido: string;
  onUpdatePedido: (newPedido: string) => void;
}

export const OrderProductList = ({ pedido, onUpdatePedido }: OrderProductListProps) => {
  const [openPopover, setOpenPopover] = useState<string | null>(null);

  // Detectar productos y sus cantidades del texto del pedido (formato: x2 PRODUCTO sin X)
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
      
      // Extraer "sin X, Y, Z"
      const sinMatch = productPart.match(/\s+sin\s+(.+)$/i);
      const excludedIngredients: string[] = [];
      let productName = productPart;
      
      if (sinMatch) {
        productName = productPart.replace(/\s+sin\s+.+$/i, '').trim();
        const excludedPart = sinMatch[1];
        excludedPart.split(/,\s*|\s+y\s+/i).forEach(ing => {
          const cleaned = ing.trim().toLowerCase();
          if (cleaned) excludedIngredients.push(cleaned);
        });
      }
      
      // Buscar el producto en el menú
      const foundItem = menuData.find(item => 
        productName.toUpperCase().includes(item.name.toUpperCase())
      );
      
      if (foundItem) {
        products.push({ 
          item: foundItem, 
          quantity, 
          excludedIngredients,
          originalSegment: trimmed
        });
      }
    });
    
    return products;
  }, [pedido]);

  const rebuildPedido = (products: DetectedProduct[]): string => {
    return products.map(p => {
      const qtyPrefix = p.quantity > 1 ? `x${p.quantity} ` : "";
      const sinPart = p.excludedIngredients.length > 0 
        ? ` sin ${p.excludedIngredients.join(", ")}` 
        : "";
      return `${qtyPrefix}${p.item.name}${sinPart}`;
    }).join(" + ");
  };

  const updateQuantity = (productIndex: number, delta: number) => {
    const newProducts = [...detectedProducts];
    const newQuantity = Math.max(0, newProducts[productIndex].quantity + delta);
    
    if (newQuantity === 0) {
      newProducts.splice(productIndex, 1);
    } else {
      newProducts[productIndex].quantity = newQuantity;
    }
    
    onUpdatePedido(rebuildPedido(newProducts));
  };

  const toggleIngredient = (productIndex: number, ingredient: string) => {
    const newProducts = [...detectedProducts];
    const product = newProducts[productIndex];
    const ingredientLower = ingredient.toLowerCase();
    
    if (product.excludedIngredients.includes(ingredientLower)) {
      product.excludedIngredients = product.excludedIngredients.filter(i => i !== ingredientLower);
    } else {
      product.excludedIngredients = [...product.excludedIngredients, ingredientLower];
    }
    
    onUpdatePedido(rebuildPedido(newProducts));
  };

  if (detectedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 space-y-2">
      <p className="text-xs text-muted-foreground font-medium">Productos detectados:</p>
      <div className="space-y-2">
        {detectedProducts.map((product, index) => {
          const price = parseFloat(product.item.price.replace('€', '').replace(',', '.'));
          const subtotal = price * product.quantity;
          const ingredients = extractIngredients(product.item.description);
          
          return (
            <div
              key={`${product.item.name}-${index}`}
              className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2 gap-2"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{product.item.name}</p>
                {product.excludedIngredients.length > 0 && (
                  <p className="text-xs text-orange-600 dark:text-orange-400">
                    Sin: {product.excludedIngredients.join(", ")}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {product.item.price} × {product.quantity} = {subtotal.toFixed(2).replace('.', ',')}€
                </p>
              </div>
              
              <div className="flex items-center gap-1">
                {/* Modify button */}
                {ingredients.length > 0 && (
                  <Popover 
                    open={openPopover === `${product.item.name}-${index}`}
                    onOpenChange={(open) => setOpenPopover(open ? `${product.item.name}-${index}` : null)}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        title="Modificar ingredientes"
                      >
                        <Settings2 className="h-3 w-3" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-2" align="end">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          Quitar ingredientes:
                        </p>
                        {ingredients.map((ingredient) => {
                          const isExcluded = product.excludedIngredients.includes(ingredient.toLowerCase());
                          return (
                            <label
                              key={ingredient}
                              className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-accent cursor-pointer"
                            >
                              <Checkbox
                                checked={isExcluded}
                                onCheckedChange={() => toggleIngredient(index, ingredient)}
                              />
                              <span className={`text-sm ${isExcluded ? "line-through text-muted-foreground" : ""}`}>
                                {ingredient}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => updateQuantity(index, -1)}
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
                  onClick={() => updateQuantity(index, 1)}
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
