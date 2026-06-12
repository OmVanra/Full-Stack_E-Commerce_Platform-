import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Star,
  ChevronRight,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/product/$id")({
  component: ProductDetail,
});

function ProductDetail() {
  const { id } = useParams({ from: "/product/$id" });
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto grid gap-10 px-4 py-10 md:grid-cols-2">
        <Skeleton className="aspect-square rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-muted-foreground font-sans">
        Product not found.
      </div>
    );
  }

  const inStock = product.stock_quantity > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground font-sans mb-8">
        <Link to="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to="/" className="hover:text-foreground transition-colors">
          Shop
        </Link>
        {product.category && (
          <>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="hover:text-foreground transition-colors">{product.category}</span>
          </>
        )}
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Image */}
        <div className="group aspect-square overflow-hidden rounded-3xl border border-border/50 bg-muted">
          {product.image_url && (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                const t = e.currentTarget;
                t.style.display = "none";
                if (t.parentElement) {
                  t.parentElement.innerHTML = `<div class="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-secondary text-muted-foreground text-lg font-sans">${product.name}</div>`;
                }
              }}
            />
          )}
        </div>

        {/* Info */}
        <div className="space-y-6 lg:py-4">
          {product.category && (
            <Badge
              variant="secondary"
              className="rounded-full px-3 py-1 text-xs font-medium font-sans"
            >
              {product.category}
            </Badge>
          )}

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 text-accent">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground font-sans">4.9 (128 reviews)</span>
          </div>

          <p className="text-3xl font-bold text-foreground font-sans">
            {formatPrice(product.price)}
          </p>

          <p className="leading-relaxed text-muted-foreground font-sans">{product.description}</p>

          {/* Stock Status */}
          <div className="flex items-center gap-2 text-sm font-sans">
            <span
              className={`inline-block h-2.5 w-2.5 rounded-full ${inStock ? "bg-green-500" : "bg-red-500"}`}
            />
            <span className="font-medium">
              {inStock ? `${product.stock_quantity} in stock` : "Out of stock"}
            </span>
          </div>

          {/* Quantity + Add to Cart */}
          {inStock && (
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center rounded-full border border-border bg-card">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center text-sm font-semibold font-sans">{qty}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setQty(Math.min(product.stock_quantity, qty + 1))}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                size="lg"
                className="flex-1 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20 transition-all hover:shadow-xl hover:shadow-accent/30 hover:scale-[1.02] font-sans"
                onClick={() => addToCart(product.id, qty)}
              >
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart —{" "}
                {formatPrice(product.price * qty)}
              </Button>
            </div>
          )}

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
            {[
              { icon: Truck, label: "Free Shipping", sub: "Over $99" },
              { icon: RotateCcw, label: "Easy Returns", sub: "30 days" },
              { icon: ShieldCheck, label: "Secure", sub: "SSL checkout" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 py-3 text-center">
                <Icon className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-xs font-semibold font-sans">{label}</p>
                  <p className="text-[10px] text-muted-foreground font-sans">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
