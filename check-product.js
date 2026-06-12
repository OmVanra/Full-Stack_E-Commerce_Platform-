// Check current Scented Candle product data

const SUPABASE_URL = "https://yuxqmollcavrbhtrwwhg.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1eHFtb2xsY2F2cmJodHJ3d2hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExMDM3ODUsImV4cCI6MjA5NjY3OTc4NX0.ScW6ydW_4sA31QE4DgZ-3icT6F6_Vn-k6Kw1tfgTFtQ";

async function checkProduct() {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*&name=ilike.*Scented*`, {
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
      },
    });

    const data = await response.json();
    console.log("Current Scented Candle product(s):");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

checkProduct();
