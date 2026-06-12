import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Minus, Plus, Trash2, ShoppingBag, Truck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function CartPage() {
  const { user, loading } = useAuth();
  const { items, subtotal, updateQty, removeItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  if (!user) return null;

  const freeShippingThreshold = 99;
  const remaining = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Shopping Cart</h1>
      <p className="mb-8 text-muted-foreground font-sans">
        {items.length} {items.length === 1 ? "item" : "items"} in your cart
      </p>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-20 text-center">
          <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
          <h2 className="text-lg font-semibold font-sans">Your cart is empty</h2>
          <p className="mt-1 text-sm text-muted-foreground font-sans">
            Looks like you haven't added anything yet.
          </p>
          <Button
            asChild
            className="mt-6 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 px-8 font-sans"
          >
            <Link to="/">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <Card
                key={item.id}
                className="flex items-center gap-4 rounded-2xl p-4 border-border/50"
              >
                <Link to="/product/$id" params={{ id: item.product_id }} className="shrink-0">
                  <div className="h-24 w-24 overflow-hidden rounded-xl bg-muted">
                    {item.product?.image_url && (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                </Link>
                <div className="min-w-0 flex-1">
                  <Link to="/product/$id" params={{ id: item.product_id }}>
                    <h3 className="font-semibold font-sans hover:text-accent transition-colors">
                      {item.product?.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground font-sans">
                    {formatPrice(item.product?.price ?? 0)} each
                  </p>
                </div>
                <div className="flex items-center rounded-full border border-border bg-card">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => updateQty(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </Button>
                  <span className="w-8 text-center text-sm font-semibold font-sans">
                    {item.quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => updateQty(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="w-20 text-right font-semibold font-sans">
                  {formatPrice(item.quantity * Number(item.product?.price ?? 0))}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </Card>
            ))}
          </div>

          <Card className="h-fit rounded-2xl p-6 border-border/50">
            {/* Free Shipping Progress */}
            <div className="mb-6 rounded-xl bg-secondary/50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium font-sans">
                <Truck className="h-4 w-4 text-accent" />
                {remaining > 0 ? (
                  <span>
                    Add <strong>{formatPrice(remaining)}</strong> for free shipping
                  </span>
                ) : (
                  <span className="text-accent font-semibold">
                    You qualify for free shipping! 🎉
                  </span>
                )}
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-500"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>

            <h2 className="mb-4 text-lg font-semibold font-sans">Order Summary</h2>
            <div className="space-y-3 text-sm font-sans">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-accent">{remaining <= 0 ? "Free" : "$9.99"}</span>
              </div>
              <div className="my-3 h-px bg-border" />
              <div className="flex justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="text-lg font-bold">
                  {formatPrice(remaining <= 0 ? subtotal : subtotal + 9.99)}
                </span>
              </div>
            </div>
            <Button
              asChild
              className="mt-6 w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20 font-sans"
              size="lg"
            >
              <Link to="/checkout" className="flex items-center justify-center gap-2">
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
