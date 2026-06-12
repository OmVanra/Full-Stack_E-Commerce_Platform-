import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, ShoppingBag, Package, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { formatPrice, statusColors } from "@/lib/format";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) navigate({ to: "/" });
  }, [loading, isAdmin, navigate]);

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    enabled: isAdmin,
    queryFn: async () => {
      const [{ data: orders }, { count: productCount }, { count: userCount }] = await Promise.all([
        supabase.from("orders").select("total_amount, status"),
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
      ]);
      const revenue =
        orders
          ?.filter((o) => o.status !== "cancelled")
          .reduce((a, o) => a + Number(o.total_amount), 0) ?? 0;
      return {
        revenue,
        orderCount: orders?.length ?? 0,
        productCount: productCount ?? 0,
        userCount: userCount ?? 0,
      };
    },
  });

  const { data: recent } = useQuery({
    queryKey: ["admin-recent-orders"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      return data ?? [];
    },
  });

  if (!isAdmin) return null;

  const cards = [
    {
      label: "Total Revenue",
      value: formatPrice(stats?.revenue ?? 0),
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      label: "Total Orders",
      value: stats?.orderCount ?? 0,
      icon: ShoppingBag,
      color: "text-blue-500",
    },
    {
      label: "Total Products",
      value: stats?.productCount ?? 0,
      icon: Package,
      color: "text-accent",
    },
    { label: "Total Users", value: stats?.userCount ?? 0, icon: Users, color: "text-purple-500" },
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-muted-foreground font-sans">Overview of your store performance</p>
        </div>
        <AdminNav />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label} className="rounded-2xl p-6 border-border/50">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground font-sans">{c.label}</p>
              <div className={`rounded-xl bg-secondary p-2 ${c.color}`}>
                <c.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-bold font-sans">{c.value}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-8 overflow-hidden rounded-2xl p-0 border-border/50">
        <div className="border-b border-border p-5">
          <h2 className="font-semibold font-sans">Recent Orders</h2>
        </div>
        <div className="divide-y divide-border">
          {recent?.length === 0 && (
            <p className="p-6 text-sm text-muted-foreground font-sans">No orders yet.</p>
          )}
          {recent?.map((o) => (
            <div
              key={o.id}
              className="flex items-center justify-between p-5 hover:bg-secondary/30 transition-colors"
            >
              <div>
                <p className="font-mono text-xs text-muted-foreground font-sans">
                  #{o.id.slice(0, 8)}
                </p>
                <p className="mt-1 text-sm font-sans">
                  {new Date(o.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <Badge className={statusColors[o.status]} variant="outline">
                {o.status}
              </Badge>
              <div className="font-semibold font-sans">{formatPrice(o.total_amount)}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function AdminNav() {
  return (
    <nav className="flex gap-1 rounded-full border border-border bg-card p-1">
      <AdminLink to="/admin/dashboard">Dashboard</AdminLink>
      <AdminLink to="/admin/products">Products</AdminLink>
      <AdminLink to="/admin/orders">Orders</AdminLink>
    </nav>
  );
}

function AdminLink({
  to,
  children,
}: {
  to: "/admin/dashboard" | "/admin/products" | "/admin/orders";
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground hover:bg-secondary font-sans transition-colors"
      activeProps={{
        className:
          "rounded-full px-4 py-1.5 text-sm font-medium bg-accent text-accent-foreground font-sans",
      }}
    >
      {children}
    </Link>
  );
}
