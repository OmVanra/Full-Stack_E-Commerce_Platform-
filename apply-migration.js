import { createClient } from "@supabase/supabase-js";

// Use environment variables or defaults
const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://yuxqmollcavrbhtrwwhg.supabase.co";
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseKey) {
  console.error("Supabase key not found");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  try {
    console.log("Applying Scented Candle image fix...");

    const { error: updateError, data } = await supabase
      .from("products")
      .update({
        image_url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800",
      })
      .eq("name", "Scented Candle")
      .eq("image_url", "https://images.unsplash.com/photo-1602874801006-e26c4c5e3897?w=800")
      .select();

    if (updateError) {
      console.error("❌ Error updating product:", updateError.message);
      process.exit(1);
    }

    if (data && data.length > 0) {
      console.log("✅ Migration applied successfully!");
      console.log(`Updated ${data.length} product(s)`);
    } else {
      console.log("⚠️  No products matched the update criteria");
      console.log("This could mean the image was already fixed or the product doesn't exist");
    }
  } catch (err) {
    console.error("❌ Unexpected error:", err.message);
    process.exit(1);
  }
}

applyMigration();
