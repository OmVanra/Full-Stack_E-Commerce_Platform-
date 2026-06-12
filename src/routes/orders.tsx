import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Package, ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { formatPrice, statusColors } from "@/lib/format";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
});

function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/auth" });
  }, [authLoading, user, navigate]);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["my-orders", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*, product:products(name, image_url))")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">My Orders</h1>
      <p className="mb-8 text-muted-foreground font-sans">Track and manage your purchases</p>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-20 text-center">
          <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
          <h2 className="text-lg font-semibold font-sans">No orders yet</h2>
          <p className="mt-1 text-sm text-muted-foreground font-sans">
            Start shopping to see your orders here.
          </p>
          <Button
            asChild
            className="mt-6 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 px-8 font-sans"
          >
            <Link to="/">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isOpen = expanded === order.id;
            return (
              <Card key={order.id} className="overflow-hidden rounded-2xl p-0 border-border/50">
                <button
                  onClick={() => setExpanded(isOpen ? null : order.id)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-secondary/30"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-accent flex-shrink-0" />
                      <span className="font-mono text-xs text-muted-foreground font-sans">
                        #{order.id.slice(0, 8)}
                      </span>
                      <Badge className={statusColors[order.status] ?? ""} variant="outline">
                        {order.status}
                      </Badge>
                    </div>
                    <p className="mt-1.5 pl-8 text-sm text-muted-foreground font-sans">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold font-sans">{formatPrice(order.total_amount)}</div>
                    <div className="text-xs text-muted-foreground font-sans">
                      {order.order_items?.length ?? 0} items
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
                {isOpen && (
                  <div className="border-t border-border bg-secondary/20 p-5">
                    <div className="space-y-3">
                      {order.order_items?.map(
                        (it: {
                          id: string;
                          quantity: number;
                          unit_price: number;
                          product: { name: string; image_url: string | null } | null;
                        }) => (
                          <div key={it.id} className="flex items-center gap-3">
                            <div className="h-14 w-14 overflow-hidden rounded-xl bg-muted">
                              {it.product?.image_url && (
                                <img
                                  src={it.product.image_url}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1 text-sm font-sans">
                              {it.product?.name} × {it.quantity}
                            </div>
                            <div className="text-sm font-semibold font-sans">
                              {formatPrice(it.quantity * Number(it.unit_price))}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
