import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/fix-image")({
  component: FixImageAdmin,
});

function FixImageAdmin() {
  const handleFix = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .update({
          image_url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800",
        })
        .eq("name", "Scented Candle")
        .eq("image_url", "https://images.unsplash.com/photo-1602874801006-e26c4c5e3897?w=800")
        .select();

      if (error) {
        alert(`❌ Error: ${error.message}`);
        return;
      }

      alert(`✅ Fixed! Updated ${data?.length || 0} product(s)`);
      if (data && data.length > 0) {
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Error:", err);
      alert(`❌ Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  };

  return (
    <div className="container mx-auto flex h-screen items-center justify-center">
      <div className="rounded-lg border border-border bg-card p-8 text-center shadow-lg">
        <h1 className="mb-4 text-2xl font-bold">Fix Scented Candle Image</h1>
        <p className="mb-6 text-muted-foreground">
          Click the button below to update the Scented Candle product image
        </p>
        <button
          onClick={handleFix}
          className="rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground hover:bg-primary/90"
        >
          Fix Image Now
        </button>
      </div>
    </div>
  );
}
