import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// Load .env manually
try {
  const envContent = readFileSync(".env", "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) return;
    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  });
} catch {
  /* .env not found, rely on existing env vars */
}

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://yuxqmollcavrbhtrwwhg.supabase.co";
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseKey) {
  console.error("❌ No Supabase key found. Set VITE_SUPABASE_PUBLISHABLE_KEY.");
  process.exit(1);
}

// Get admin credentials from CLI args or prompt
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error("Usage: node seed-products.js <admin-email> <admin-password>");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const newProducts = [
  // ── Electronics (7 more) ──────────────────────────────────────────
  {
    name: "Bluetooth Speaker",
    description: "Portable waterproof speaker with 360° surround sound and 12-hour battery.",
    price: 79.99,
    stock_quantity: 50,
    category: "Electronics",
    image_url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800",
  },
  {
    name: "USB-C Hub",
    description: "7-in-1 USB-C hub with HDMI, Ethernet, SD card reader, and USB 3.0 ports.",
    price: 54.99,
    stock_quantity: 70,
    category: "Electronics",
    image_url: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800",
  },
  {
    name: "Wireless Mouse",
    description: "Ergonomic silent-click mouse with adjustable DPI and dual-mode connectivity.",
    price: 39.99,
    stock_quantity: 90,
    category: "Electronics",
    image_url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800",
  },
  {
    name: "Noise-Cancelling Earbuds",
    description: "True wireless earbuds with active noise cancellation and transparency mode.",
    price: 149.0,
    stock_quantity: 35,
    category: "Electronics",
    image_url: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=800",
  },
  {
    name: "Portable Charger",
    description: "20000mAh power bank with fast charging and LED display.",
    price: 44.99,
    stock_quantity: 65,
    category: "Electronics",
    image_url: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800",
  },
  {
    name: "Webcam HD",
    description: "1080p webcam with built-in ring light and auto-focus for streaming.",
    price: 69.0,
    stock_quantity: 40,
    category: "Electronics",
    image_url: "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=800",
  },
  {
    name: "Tablet Stand",
    description: "Adjustable aluminum stand for tablets and phones with cable management.",
    price: 34.99,
    stock_quantity: 55,
    category: "Electronics",
    image_url: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800",
  },

  // ── Accessories (8 more) ──────────────────────────────────────────
  {
    name: "Sunglasses",
    description: "Polarized UV400 aviator sunglasses with metal frame.",
    price: 65.0,
    stock_quantity: 45,
    category: "Accessories",
    image_url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800",
  },
  {
    name: "Canvas Belt",
    description: "Woven cotton canvas belt with brushed nickel buckle.",
    price: 28.0,
    stock_quantity: 80,
    category: "Accessories",
    image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a45?w=800",
  },
  {
    name: "Leather Watch Strap",
    description: "Handmade Italian leather strap compatible with most 20mm watches.",
    price: 42.0,
    stock_quantity: 55,
    category: "Accessories",
    image_url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800",
  },
  {
    name: "Wool Scarf",
    description: "Soft merino wool scarf in herringbone pattern.",
    price: 55.0,
    stock_quantity: 40,
    category: "Accessories",
    image_url: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800",
  },
  {
    name: "Baseball Cap",
    description: "Embroidered cotton twill cap with adjustable strap.",
    price: 24.0,
    stock_quantity: 100,
    category: "Accessories",
    image_url: "https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=800",
  },
  {
    name: "Crossbody Bag",
    description: "Compact nylon crossbody bag with RFID-blocking pocket.",
    price: 68.0,
    stock_quantity: 30,
    category: "Accessories",
    image_url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",
  },
  {
    name: "Beaded Bracelet",
    description: "Natural stone beaded bracelet with adjustable cord.",
    price: 18.0,
    stock_quantity: 120,
    category: "Accessories",
    image_url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800",
  },
  {
    name: "Travel Organizer",
    description: "Water-resistant tech organizer pouch for cables and accessories.",
    price: 32.0,
    stock_quantity: 50,
    category: "Accessories",
    image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
  },

  // ── Apparel (8 more) ──────────────────────────────────────────────
  {
    name: "Linen Shirt",
    description: "Breathable pure linen button-down shirt for warm weather.",
    price: 62.0,
    stock_quantity: 50,
    category: "Apparel",
    image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800",
  },
  {
    name: "Chino Pants",
    description: "Slim-fit stretch chino pants in classic khaki.",
    price: 58.0,
    stock_quantity: 45,
    category: "Apparel",
    image_url: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800",
  },
  {
    name: "Hoodie",
    description: "Heavyweight French-terry hoodie with kangaroo pocket.",
    price: 74.0,
    stock_quantity: 55,
    category: "Apparel",
    image_url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
  },
  {
    name: "Running Shorts",
    description: "Lightweight moisture-wicking shorts with built-in liner.",
    price: 38.0,
    stock_quantity: 70,
    category: "Apparel",
    image_url: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800",
  },
  {
    name: "Wool Sweater",
    description: "Chunky-knit crew neck sweater in heather grey.",
    price: 95.0,
    stock_quantity: 30,
    category: "Apparel",
    image_url: "https://images.unsplash.com/photo-1434389677669-e08b4cda3a58?w=800",
  },
  {
    name: "Puffer Vest",
    description: "Packable down puffer vest with water-resistant shell.",
    price: 110.0,
    stock_quantity: 25,
    category: "Apparel",
    image_url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800",
  },
  {
    name: "Polo Shirt",
    description: "Piqué cotton polo with contrast collar and embroidered logo.",
    price: 48.0,
    stock_quantity: 60,
    category: "Apparel",
    image_url: "https://images.unsplash.com/photo-1625910513413-5fc421e0fd9e?w=800",
  },
  {
    name: "Cargo Joggers",
    description: "Relaxed-fit utility joggers with side cargo pockets.",
    price: 55.0,
    stock_quantity: 40,
    category: "Apparel",
    image_url: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800",
  },

  // ── Home (7 more) ─────────────────────────────────────────────────
  {
    name: "Indoor Plant Pot",
    description: "Matte white ceramic planter with bamboo tray, 6-inch.",
    price: 22.0,
    stock_quantity: 60,
    category: "Home",
    image_url: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800",
  },
  {
    name: "Throw Blanket",
    description: "Ultra-soft chunky knit throw blanket, 50×60 inches.",
    price: 59.0,
    stock_quantity: 35,
    category: "Home",
    image_url: "https://images.unsplash.com/photo-1580301762395-21ce12d4bc2b?w=800",
  },
  {
    name: "Wall Clock",
    description: "Minimalist wooden wall clock with silent quartz movement.",
    price: 48.0,
    stock_quantity: 40,
    category: "Home",
    image_url: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800",
  },
  {
    name: "Cutting Board Set",
    description: "Set of 3 bamboo cutting boards with juice grooves.",
    price: 34.0,
    stock_quantity: 55,
    category: "Home",
    image_url: "https://images.unsplash.com/photo-1605522561233-768ad7a8fabf?w=800",
  },
  {
    name: "Linen Napkins",
    description: "Set of 6 stone-washed linen dinner napkins.",
    price: 28.0,
    stock_quantity: 70,
    category: "Home",
    image_url: "https://images.unsplash.com/photo-1563299796-17596ed6b017?w=800",
  },
  {
    name: "Essential Oil Diffuser",
    description: "Ultrasonic aroma diffuser with LED mood lighting, 300ml.",
    price: 36.0,
    stock_quantity: 50,
    category: "Home",
    image_url: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800",
  },
  {
    name: "Picture Frame Set",
    description: "Gallery wall set of 5 wooden frames in assorted sizes.",
    price: 42.0,
    stock_quantity: 45,
    category: "Home",
    image_url: "https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=800",
  },
];

async function seedProducts() {
  // 1. Sign in as the admin user
  console.log(`🔐 Signing in as ${email}...`);
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError) {
    console.error("❌ Sign-in failed:", signInError.message);
    process.exit(1);
  }
  console.log("✅ Signed in successfully.\n");

  // 2. Insert all new products
  console.log(`🌱 Inserting ${newProducts.length} new products...\n`);

  const { data, error } = await supabase
    .from("products")
    .insert(newProducts)
    .select("id, name, category");

  if (error) {
    console.error("❌ Insert failed:", error.message);
    console.error("   Details:", error.details);
    console.error("   Hint:", error.hint);
    process.exit(1);
  }

  console.log(`✅ Successfully inserted ${data.length} products!\n`);

  // 3. Print summary by category
  const summary = {};
  data.forEach((p) => {
    summary[p.category] = (summary[p.category] || 0) + 1;
  });
  console.log("📦 New products by category:");
  Object.entries(summary)
    .sort()
    .forEach(([cat, count]) => console.log(`   ${cat}: +${count}`));

  // 4. Verify totals
  const { data: totals } = await supabase.from("products").select("category");
  const totalSummary = {};
  totals?.forEach((p) => {
    totalSummary[p.category] = (totalSummary[p.category] || 0) + 1;
  });
  console.log("\n📊 Total products per category:");
  Object.entries(totalSummary)
    .sort()
    .forEach(([cat, count]) => console.log(`   ${cat}: ${count}`));

  await supabase.auth.signOut();
}

seedProducts();
