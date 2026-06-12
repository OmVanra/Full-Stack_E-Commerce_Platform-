import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

export type CartItem = {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
    stock_quantity: number;
  };
};

interface CartState {
  items: CartItem[];
  count: number;
  subtotal: number;
  loading: boolean;
  addToCart: (productId: string, qty?: number) => Promise<void>;
  updateQty: (itemId: string, qty: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartState | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("cart_items")
      .select(
        "id, product_id, quantity, product:products(id, name, price, image_url, stock_quantity)",
      )
      .eq("user_id", user.id);
    setItems((data as unknown as CartItem[]) ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addToCart = async (productId: string, qty = 1) => {
    if (!user) {
      toast.error("Please sign in to add to cart");
      return;
    }
    const existing = items.find((i) => i.product_id === productId);
    if (existing) {
      // optimistic
      setItems((prev) =>
        prev.map((i) => (i.id === existing.id ? { ...i, quantity: i.quantity + qty } : i)),
      );
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity + qty })
        .eq("id", existing.id);
      if (error) {
        toast.error(error.message);
        refresh();
        return;
      }
    } else {
      const { error } = await supabase
        .from("cart_items")
        .insert({ user_id: user.id, product_id: productId, quantity: qty });
      if (error) {
        toast.error(error.message);
        return;
      }
      await refresh();
    }
    toast.success("Added to cart");
  };

  const updateQty = async (itemId: string, qty: number) => {
    if (qty < 1) return removeItem(itemId);
    setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, quantity: qty } : i)));
    await supabase.from("cart_items").update({ quantity: qty }).eq("id", itemId);
  };

  const removeItem = async (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    await supabase.from("cart_items").delete().eq("id", itemId);
  };

  const clearCart = async () => {
    if (!user) return;
    await supabase.from("cart_items").delete().eq("user_id", user.id);
    setItems([]);
  };

  const count = items.reduce((a, i) => a + i.quantity, 0);
  const subtotal = items.reduce((a, i) => a + i.quantity * Number(i.product?.price ?? 0), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        subtotal,
        loading,
        addToCart,
        updateQty,
        removeItem,
        clearCart,
        refresh,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
