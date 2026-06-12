import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { formatPrice } from "@/lib/format";
import { AdminNav } from "./admin.dashboard";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

type ProductForm = {
  id?: string;
  name: string;
  description: string;
  price: string;
  stock_quantity: string;
  category: string;
  image_url: string;
  is_active: boolean;
};

const empty: ProductForm = {
  name: "",
  description: "",
  price: "",
  stock_quantity: "0",
  category: "",
  image_url: "",
  is_active: true,
};

function AdminProducts() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ProductForm>(empty);

  useEffect(() => {
    if (!loading && !isAdmin) navigate({ to: "/" });
  }, [loading, isAdmin, navigate]);

  const { data: products } = useQuery({
    queryKey: ["admin-products"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const startEdit = (p: typeof empty & { id?: string }) => {
    setForm({ ...p });
    setOpen(true);
  };

  const startNew = () => {
    setForm(empty);
    setOpen(true);
  };

  const save = async () => {
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock_quantity: Number(form.stock_quantity),
      category: form.category || null,
      image_url: form.image_url || null,
      is_active: form.is_active,
    };
    const { error } = form.id
      ? await supabase.from("products").update(payload).eq("id", form.id)
      : await supabase.from("products").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(form.id ? "Product updated" : "Product created");
    setOpen(false);
    qc.invalidateQueries({ queryKey: ["admin-products"] });
    qc.invalidateQueries({ queryKey: ["products"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin-products"] });
    qc.invalidateQueries({ queryKey: ["products"] });
  };

  if (!isAdmin) return null;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="mt-1 text-muted-foreground font-sans">Manage your product catalog</p>
        </div>
        <AdminNav />
      </div>

      <div className="mb-4 flex justify-end">
        <Button
          onClick={startNew}
          className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 font-sans"
        >
          <Plus className="mr-1.5 h-4 w-4" /> New Product
        </Button>
      </div>

      <Card className="overflow-hidden rounded-2xl p-0 border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-left">
              <tr>
                <th className="p-4 font-semibold font-sans">Product</th>
                <th className="p-4 font-semibold font-sans">Category</th>
                <th className="p-4 font-semibold font-sans">Price</th>
                <th className="p-4 font-semibold font-sans">Stock</th>
                <th className="p-4 font-semibold font-sans">Active</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products?.map((p) => (
                <tr key={p.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 overflow-hidden rounded-xl bg-muted flex-shrink-0">
                        {p.image_url && (
                          <img src={p.image_url} alt="" className="h-full w-full object-cover" />
                        )}
                      </div>
                      <span className="font-medium font-sans">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground font-sans">{p.category}</td>
                  <td className="p-4 font-sans">{formatPrice(p.price)}</td>
                  <td className="p-4 font-sans">{p.stock_quantity}</td>
                  <td className="p-4 font-sans">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${p.is_active ? "bg-green-500" : "bg-red-400"}`}
                    />
                    <span className="ml-2">{p.is_active ? "Yes" : "No"}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full"
                        onClick={() =>
                          startEdit({
                            ...p,
                            price: String(p.price),
                            stock_quantity: String(p.stock_quantity),
                            category: p.category ?? "",
                            image_url: p.image_url ?? "",
                            description: p.description ?? "",
                          })
                        }
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10"
                        onClick={() => remove(p.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-sans">{form.id ? "Edit" : "New"} Product</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="space-y-1.5">
              <Label className="font-sans">Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="rounded-xl font-sans"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-sans">Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="rounded-xl font-sans"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-sans">Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="rounded-xl font-sans"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-sans">Stock</Label>
                <Input
                  type="number"
                  value={form.stock_quantity}
                  onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
                  className="rounded-xl font-sans"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="font-sans">Category</Label>
              <Input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="rounded-xl font-sans"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-sans">Image URL</Label>
              <Input
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                className="rounded-xl font-sans"
              />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <Label className="font-sans">Active</Label>
              <Switch
                checked={form.is_active}
                onCheckedChange={(v) => setForm({ ...form, is_active: v })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              className="rounded-full font-sans"
            >
              Cancel
            </Button>
            <Button
              onClick={save}
              className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 font-sans"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
