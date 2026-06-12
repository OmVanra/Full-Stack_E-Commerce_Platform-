// This script attempts to fix the Scented Candle image using the REST API
// with proper authentication

const SUPABASE_URL = "https://yuxqmollcavrbhtrwwhg.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1eHFtb2xsY2F2cmJodHJ3d2hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExMDM3ODUsImV4cCI6MjA5NjY3OTc4NX0.ScW6ydW_4sA31QE4DgZ-3icT6F6_Vn-k6Kw1tfgTFtQ";

async function fixScentedCandleImage() {
  const newImageUrl = "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800";
  const oldImageUrl = "https://images.unsplash.com/photo-1602874801006-e26c4c5e3897?w=800";

  try {
    console.log("Attempting to fix Scented Candle image...");

    // First, let's fetch the current product to verify it exists
    const getResponse = await fetch(`${SUPABASE_URL}/rest/v1/products?name=eq.Scented%20Candle`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
      },
    });

    if (!getResponse.ok) {
      throw new Error(`Failed to fetch product: ${getResponse.statusText}`);
    }

    const products = await getResponse.json();
    console.log("Found products:", products);

    if (!products || products.length === 0) {
      console.log("Product not found");
      return { success: false, error: "Product not found" };
    }

    // Now attempt to update
    const updateResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/products?name=eq.Scented%20Candle&image_url=eq.${encodeURIComponent(oldImageUrl)}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          image_url: newImageUrl,
        }),
      },
    );

    const updateData = await updateResponse.json();

    if (!updateResponse.ok) {
      console.error("Update failed:", updateData);
      return { success: false, error: updateData.message || updateResponse.statusText };
    }

    console.log("✅ Successfully updated product:", updateData);
    return { success: true, data: updateData };
  } catch (error) {
    console.error("Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Run the fix
fixScentedCandleImage().then((result) => {
  console.log("Final result:", result);
  process.exit(result.success ? 0 : 1);
});
