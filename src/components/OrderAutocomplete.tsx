import { useState, useRef, useEffect } from "react";
import { menuData, extractIngredients, MenuItem } from "@/data/menuData";
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
  const [suggestions, setSuggestions] = useState<{ label: string; type: "product" | "ingredient"; item?: MenuItem }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const lowerValue = value.toLowerCase();
    
    // Get the last segment after "," or " y " (for multiple products)
    const segments = lowerValue.split(/,\s*|\s+y\s+/);
    const lastSegment = segments[segments.length - 1].trim();
    
    // Check if user is typing "sin" anywhere in the last segment
    const sinMatch = lastSegment.match(/sin\s*(\w*)$/i);
    
    if (sinMatch) {
      // User is typing "sin..." - show ingredients from the product in this segment
      const searchTerm = sinMatch[1].toLowerCase();
      
      // Find the product mentioned before "sin" in this segment
      const beforeSin = lastSegment.replace(/sin\s*\w*$/i, "").trim();
      const detectedProduct = menuData.find(item => 
        beforeSin.includes(item.name.toLowerCase())
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
      setShowSuggestions(filtered.length > 0);
    } else if (lastSegment.length > 0) {
      // Normal product search - only match from the beginning
      const filtered = menuData
        .filter(item => 
          item.name.toLowerCase().startsWith(lastSegment)
        )
        .slice(0, 8)
        .map(item => ({ 
          label: `${item.name} - ${item.price}`, 
          type: "product" as const,
          item 
        }));
      
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value, selectedProduct]);

  const handleSelect = (suggestion: { label: string; type: "product" | "ingredient"; item?: MenuItem }) => {
    // Get the part before the last segment
    const segments = value.split(/,\s*|\s+y\s+/);
    const prefix = segments.slice(0, -1).join(", ");
    const separator = prefix ? ", " : "";
    
    if (suggestion.type === "product" && suggestion.item) {
      onChange(prefix + separator + suggestion.item.name);
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

  return (
    <div className="relative">
      <textarea
        ref={inputRef}
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => value.length > 0 && setShowSuggestions(suggestions.length > 0)}
        placeholder={placeholder}
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        rows={3}
      />
      
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
