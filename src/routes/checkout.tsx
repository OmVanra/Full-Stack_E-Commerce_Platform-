import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatPrice } from "@/lib/format";
import { ShieldCheck, Lock } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  component: Checkout,
});

function Checkout() {
  const { user, loading } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    address: "",
    city: "",
    pincode: "",
    phone: "",
  });

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (items.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    setSubmitting(true);
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        total_amount: subtotal,
        status: "pending",
        shipping_address: form,
      })
      .select()
      .single();
    if (error || !order) {
      toast.error(error?.message ?? "Failed to place order");
      setSubmitting(false);
      return;
    }
    const { error: itemsError } = await supabase.from("order_items").insert(
      items.map((i) => ({
        order_id: order.id,
        product_id: i.product_id,
        quantity: i.quantity,
        unit_price: i.product.price,
      })),
    );
    if (itemsError) {
      toast.error(itemsError.message);
      setSubmitting(false);
      return;
    }
    await clearCart();
    toast.success("Order placed successfully!");
    navigate({ to: "/orders" });
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Checkout</h1>
      <p className="mb-8 text-muted-foreground font-sans">Complete your order details below</p>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
        <Card className="space-y-5 rounded-2xl p-6 lg:p-8 lg:col-span-2 border-border/50">
          <h2 className="text-lg font-semibold font-sans">Shipping Address</h2>
          {[
            { k: "full_name", label: "Full name", type: "text" },
            { k: "address", label: "Street address", type: "text" },
            { k: "city", label: "City", type: "text" },
            { k: "pincode", label: "Postal code", type: "text" },
            { k: "phone", label: "Phone number", type: "tel" },
          ].map((f) => (
            <div key={f.k} className="space-y-1.5">
              <Label className="text-sm font-sans">{f.label}</Label>
              <Input
                type={f.type}
                required
                value={(form as Record<string, string>)[f.k]}
                onChange={(e) => setForm((p) => ({ ...p, [f.k]: e.target.value }))}
                className="rounded-xl font-sans"
              />
            </div>
          ))}

          <div className="flex items-center gap-2 rounded-xl bg-secondary/50 p-3 text-xs text-muted-foreground font-sans">
            <Lock className="h-4 w-4 text-accent" />
            Your information is encrypted and secure
          </div>
        </Card>

        <Card className="h-fit rounded-2xl p-6 border-border/50">
          <h2 className="mb-4 text-lg font-semibold font-sans">Order Summary</h2>
          <div className="space-y-3 text-sm font-sans">
            {items.map((i) => (
              <div key={i.id} className="flex justify-between gap-2">
                <span className="text-muted-foreground truncate flex-1">
                  {i.product?.name} × {i.quantity}
                </span>
                <span className="font-medium">
                  {formatPrice(i.quantity * Number(i.product?.price ?? 0))}
                </span>
              </div>
            ))}
            <div className="my-3 h-px bg-border" />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium text-accent">{subtotal >= 99 ? "Free" : "$9.99"}</span>
            </div>
            <div className="my-3 h-px bg-border" />
            <div className="flex justify-between text-base">
              <span className="font-semibold">Total</span>
              <span className="text-lg font-bold">
                {formatPrice(subtotal >= 99 ? subtotal : subtotal + 9.99)}
              </span>
            </div>
          </div>
          <Button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20 font-sans"
            size="lg"
          >
            {submitting ? "Placing Order..." : "Place Order"}
          </Button>
          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground font-sans">
            <ShieldCheck className="h-3.5 w-3.5" /> Secure SSL Checkout
          </div>
        </Card>
      </form>
    </div>
  );
}
