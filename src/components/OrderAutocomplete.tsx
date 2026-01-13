import { useState, useRef, useEffect, useCallback } from "react";
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

// Normalize text for comparison (remove accents, lowercase)
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s]/g, ""); // Keep only letters, numbers, spaces
};

// Check if a text matches a product name (fuzzy match)
const matchesProduct = (text: string, productName: string): boolean => {
  const normalizedText = normalizeText(text);
  const normalizedProduct = normalizeText(productName);
  
  // Exact match
  if (normalizedText === normalizedProduct) return true;
  
  // Text contains the product name
  if (normalizedText.includes(normalizedProduct)) return true;
  
  // Product name contains the text (for partial matches)
  if (normalizedProduct.includes(normalizedText) && normalizedText.length >= 3) return true;
  
  // Check word by word for multi-word products
  const textWords = normalizedText.split(/\s+/);
  const productWords = normalizedProduct.split(/\s+/);
  
  // All words from text should match words in product
  return textWords.every(tw => 
    productWords.some(pw => pw.includes(tw) || tw.includes(pw))
  );
};

// Find the best matching product for a text segment
const findMatchingProduct = (text: string): MenuItem | null => {
  const normalizedText = normalizeText(text);
  if (normalizedText.length < 2) return null;
  
  // First try exact matches
  for (const item of menuData) {
    if (normalizeText(item.name) === normalizedText) {
      return item;
    }
  }
  
  // Then try partial matches, prioritizing longer matches
  const matches = menuData.filter(item => matchesProduct(text, item.name));
  
  if (matches.length === 0) return null;
  
  // Return the best match (prefer longer product names as they're more specific)
  return matches.sort((a, b) => b.name.length - a.name.length)[0];
};

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
  const lastNormalizedValue = useRef<string>("");

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

  // Normalize and detect products when value changes
  const normalizeOrder = useCallback((text: string): string => {
    // Split by common separators: +, comma, "y", newlines
    const segments = text.split(/\s*[+,]\s*|\s+y\s+|\n/gi);
    
    const normalizedSegments: string[] = [];
    
    for (const segment of segments) {
      const trimmed = segment.trim();
      if (!trimmed) continue;
      
      // Check for quantity prefix (x1, x2, 2x, etc.)
      const quantityMatch = trimmed.match(/^x?(\d+)\s*x?\s*/i);
      let quantity = 1;
      let productText = trimmed;
      
      if (quantityMatch) {
        quantity = parseInt(quantityMatch[1]);
        productText = trimmed.replace(/^x?\d+\s*x?\s*/i, "").trim();
      }
      
      // Check for "sin" modifier
      const sinMatch = productText.match(/\s+sin\s+(.+)$/i);
      let sinModifier = "";
      let mainProductText = productText;
      
      if (sinMatch) {
        sinModifier = ` sin ${sinMatch[1].toLowerCase()}`;
        mainProductText = productText.replace(/\s+sin\s+.+$/i, "").trim();
      }
      
      // Find matching product
      const matchedProduct = findMatchingProduct(mainProductText);
      
      if (matchedProduct) {
        // Format with quantity prefix
        const quantityPrefix = quantity > 1 ? `x${quantity} ` : "x1 ";
        normalizedSegments.push(quantityPrefix + matchedProduct.name + sinModifier);
      } else if (trimmed) {
        // Keep original text if no match
        normalizedSegments.push(trimmed);
      }
    }
    
    return normalizedSegments.join(" + ");
  }, []);

  // Auto-normalize on blur (when user finishes typing)
  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setIsFocused(false);
      
      // Normalize the order when user stops editing
      if (value.trim()) {
        const normalized = normalizeOrder(value);
        if (normalized !== value && normalized !== lastNormalizedValue.current) {
          lastNormalizedValue.current = normalized;
          onChange(normalized);
        }
      }
    }, 200);
  }, [value, normalizeOrder, onChange]);

  // Show ingredient suggestions when typing "sin"
  useEffect(() => {
    const lowerValue = value.toLowerCase();
    
    // Get the last segment
    const segments = lowerValue.split(/\s*\+\s*/);
    const lastSegment = segments[segments.length - 1].trim();
    
    // Check if user is typing "sin"
    const sinMatch = lastSegment.match(/sin\s*(\w*)$/i);
    
    if (sinMatch) {
      const searchTerm = sinMatch[1].toLowerCase();
      const beforeSin = lastSegment.replace(/\s*sin\s*\w*$/i, "").trim();
      const detectedProduct = menuData.find(item => 
        normalizeText(beforeSin).includes(normalizeText(item.name)) ||
        normalizeText(item.name).includes(normalizeText(beforeSin))
      );
      
      let ingredients: string[] = [];
      if (detectedProduct) {
        ingredients = extractIngredients(detectedProduct.description);
        setSelectedProduct(detectedProduct);
      } else if (selectedProduct) {
        ingredients = extractIngredients(selectedProduct.description);
      }
      
      const filtered = ingredients
        .filter(ing => searchTerm === "" || ing.startsWith(searchTerm))
        .map(ing => ({ label: ing, type: "ingredient" as const }));
      
      setSuggestions(filtered);
      setShowSuggestions(isFocused && filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value, selectedProduct, isFocused]);

  const handleSelect = (suggestion: { label: string; type: "product" | "ingredient"; item?: MenuItem }) => {
    if (suggestion.type === "ingredient") {
      // Replace "sin X" with full ingredient
      const segments = value.split(/\s*\+\s*/);
      const lastSegment = segments[segments.length - 1];
      const newLastSegment = lastSegment.replace(/sin\s*\w*$/i, `sin ${suggestion.label}`);
      const prefix = segments.slice(0, -1).join(" + ");
      const separator = prefix ? " + " : "";
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
          }}
          onBlur={handleBlur}
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
              <span>{suggestion.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
