import { useState, useRef, useEffect } from "react";
import { menuData, extractIngredients, MenuItem } from "@/data/menuData";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  name?: string;
}

export const OrderAutocomplete = ({
  value,
  onChange,
  placeholder,
  className,
  id,
  name,
}: OrderAutocompleteProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showProductMenu, setShowProductMenu] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<{ label: string; type: "product" | "ingredient"; item?: MenuItem }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const productMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
      if (
        productMenuRef.current &&
        !productMenuRef.current.contains(e.target as Node)
      ) {
        setShowProductMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const lowerValue = value.toLowerCase();
    
    // Get the last segment after " + " (for multiple products)
    const segments = lowerValue.split(/\s*\+\s*/);
    const lastSegment = segments[segments.length - 1].trim();
    
    // Check if user just typed a separator - show all products
    const endsWithSeparator = /[,]\s*$/.test(value) || /\s+y\s*$/i.test(value);
    
    if (endsWithSeparator) {
      // Show all products when user types "," or " y "
      const allProducts = menuData
        .slice(0, 8)
        .map(item => ({ 
          label: `${item.name} - ${item.price}`, 
          type: "product" as const,
          item 
        }));
      setSuggestions(allProducts);
      setShowSuggestions(isFocused && allProducts.length > 0);
      return;
    }
    
    // Check if user is typing "sin" anywhere in the last segment
    const sinMatch = lastSegment.match(/sin\s*(\w*)$/i);
    
    // Check if user just typed " sin" (with space before) - show ingredients immediately
    const justTypedSin = /\s+sin\s*$/i.test(lastSegment);
    
    if (sinMatch || justTypedSin) {
      // User is typing "sin..." - show ingredients from the product in this segment
      const searchTerm = sinMatch ? sinMatch[1].toLowerCase() : "";
      
      // Find the product mentioned before "sin" in this segment
      const beforeSin = lastSegment.replace(/\s*sin\s*\w*$/i, "").trim();
      const detectedProduct = menuData.find(item => 
        beforeSin.toUpperCase().includes(item.name.toUpperCase())
      );
      
      let ingredients: string[] = [];
      if (detectedProduct) {
        ingredients = extractIngredients(detectedProduct.description);
        if (detectedProduct !== selectedProduct) {
          setSelectedProduct(detectedProduct);
        }
      } else if (selectedProduct) {
        ingredients = extractIngredients(selectedProduct.description);
      }
      
      const filtered = ingredients
        .filter(ing => searchTerm === "" || ing.startsWith(searchTerm))
        .map(ing => ({ label: ing, type: "ingredient" as const }));
      
      setSuggestions(filtered);
      setShowSuggestions(isFocused && filtered.length > 0);
    } else if (lastSegment.length > 0) {
      const words = lastSegment.split(/\s+/);
      const lastWord = words[words.length - 1];
      
      const filtered = menuData
        .filter(item => {
          const itemNameLower = item.name.toLowerCase();
          return itemNameLower.startsWith(lastWord) ||
            itemNameLower.includes(lastWord) ||
            lastWord.includes(itemNameLower.substring(0, Math.min(3, itemNameLower.length)));
        })
        .sort((a, b) => {
          const aStarts = a.name.toLowerCase().startsWith(lastWord) ? 0 : 1;
          const bStarts = b.name.toLowerCase().startsWith(lastWord) ? 0 : 1;
          return aStarts - bStarts;
        })
        .slice(0, 8)
        .map(item => ({ 
          label: `${item.name} - ${item.price}`, 
          type: "product" as const,
          item 
        }));
      
      setSuggestions(filtered);
      setShowSuggestions(isFocused && filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value, selectedProduct, isFocused]);

  const handleSelect = (suggestion: { label: string; type: "product" | "ingredient"; item?: MenuItem }) => {
    // Replace any trailing "," or " y " with " + " first
    let cleanedValue = value.replace(/,\s*$/, " + ").replace(/\s+y\s*$/i, " + ");
    
    // Get the part before the last segment
    const segments = cleanedValue.split(/\s*\+\s*/);
    const prefix = segments.slice(0, -1).join(" + ");
    const separator = prefix ? " + " : "";
    
    if (suggestion.type === "product" && suggestion.item) {
      // Always add x1 prefix when selecting a product
      onChange(prefix + separator + "x1 " + suggestion.item.name);
      setSelectedProduct(suggestion.item);
    } else if (suggestion.type === "ingredient") {
      // Replace "sin X" with the full ingredient
      const lastSegment = segments[segments.length - 1];
      const newLastSegment = lastSegment.replace(/sin\s*\w*$/i, `sin ${suggestion.label}`);
      onChange(prefix + separator + newLastSegment);
    }
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleAddProduct = (item: MenuItem) => {
    const separator = value.trim() ? " + " : "";
    onChange(value + separator + "x1 " + item.name);
    setShowProductMenu(false);
    inputRef.current?.focus();
  };

  // Group products by category
  const groupedProducts = menuData.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="relative">
      <div className="relative">
        <textarea
          ref={inputRef}
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            if (value.length > 0 && suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => {
            // Delay to allow click on suggestions
            setTimeout(() => setIsFocused(false), 150);
          }}
          placeholder={placeholder}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 pr-12 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          rows={3}
        />
        
        {/* Add product button */}
        <button
          type="button"
          onClick={() => setShowProductMenu(!showProductMenu)}
          className="absolute right-2 top-2 p-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          title="Añadir producto"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Product menu dropdown */}
      {showProductMenu && (
        <div
          ref={productMenuRef}
          className="absolute z-50 top-full right-0 mt-1 w-72 bg-popover border border-border rounded-md shadow-lg max-h-80 overflow-y-auto"
        >
          <div className="p-2 border-b border-border">
            <span className="text-sm font-medium text-foreground">Añadir producto</span>
          </div>
          {Object.entries(groupedProducts).map(([category, items]) => (
            <div key={category}>
              <div className="px-3 py-1.5 bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {category}
              </div>
              {items.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleAddProduct(item)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-between gap-2"
                >
                  <span className="font-medium">{item.name}</span>
                  <span className="text-xs text-muted-foreground">{item.price}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
      
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(suggestion)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
            >
              {suggestion.type === "ingredient" && (
                <span className="text-xs text-muted-foreground">sin</span>
              )}
              <span className={suggestion.type === "product" ? "font-medium" : ""}>
                {suggestion.label}
              </span>
              {suggestion.type === "product" && suggestion.item?.description && (
                <span className="text-xs text-muted-foreground ml-auto truncate max-w-[200px]">
                  {suggestion.item.description}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
