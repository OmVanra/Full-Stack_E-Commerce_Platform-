import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { formatPrice, statusColors } from "@/lib/format";
import { AdminNav } from "./admin.dashboard";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

function AdminOrders() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  useEffect(() => {
    if (!loading && !isAdmin) navigate({ to: "/" });
  }, [loading, isAdmin, navigate]);

  const { data: orders } = useQuery({
    queryKey: ["admin-orders"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data } = await supabase
        .from("orders")
        .select("*, profile:profiles(full_name, id)")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status updated");
    qc.invalidateQueries({ queryKey: ["admin-orders"] });
  };

  if (!isAdmin) return null;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="mt-1 text-muted-foreground font-sans">Manage and track customer orders</p>
        </div>
        <AdminNav />
      </div>

      <Card className="overflow-hidden rounded-2xl p-0 border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-left">
              <tr>
                <th className="p-4 font-semibold font-sans">Order</th>
                <th className="p-4 font-semibold font-sans">Customer</th>
                <th className="p-4 font-semibold font-sans">Date</th>
                <th className="p-4 font-semibold font-sans">Total</th>
                <th className="p-4 font-semibold font-sans">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders?.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground font-sans">
                    No orders yet.
                  </td>
                </tr>
              )}
              {orders?.map((o) => (
                <tr key={o.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="p-4 font-mono text-xs font-sans">#{o.id.slice(0, 8)}</td>
                  <td className="p-4 font-sans">
                    {(o as { profile?: { full_name?: string } }).profile?.full_name ?? "—"}
                  </td>
                  <td className="p-4 text-muted-foreground font-sans">
                    {new Date(o.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="p-4 font-semibold font-sans">{formatPrice(o.total_amount)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Badge className={statusColors[o.status]} variant="outline">
                        {o.status}
                      </Badge>
                      <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v)}>
                        <SelectTrigger className="h-8 w-36 rounded-lg font-sans">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((s) => (
                            <SelectItem key={s} value={s} className="font-sans capitalize">
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
