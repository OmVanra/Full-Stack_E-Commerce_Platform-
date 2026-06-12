import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  Search,
  ShoppingCart,
  Sparkles,
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
  Star,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Velora — Premium Curated Marketplace" },
      {
        name: "description",
        content: "Discover handpicked electronics, accessories, apparel, and home goods at Velora.",
      },
      { property: "og:title", content: "Velora — Premium Curated Marketplace" },
      {
        property: "og:description",
        content: "Discover handpicked electronics, accessories, apparel, and home goods at Velora.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const { addToCart } = useCart();

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const categories = useMemo(() => {
    const set = new Set<string>();
    products?.forEach((p) => p.category && set.add(p.category));
    return ["all", ...Array.from(set)];
  }, [products]);

  const filtered = useMemo(() => {
    return (products ?? []).filter((p) => {
      const matchesCat = category === "all" || p.category === category;
      const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [products, search, category]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary">
        {/* Decorative elements */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-10 left-10 h-52 w-52 rounded-full bg-accent/5 blur-3xl" />

        <div className="container relative mx-auto px-4 py-20 text-primary-foreground md:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left — Text content */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/5 px-4 py-1.5 text-xs font-medium backdrop-blur-sm font-sans">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                <span>New arrivals every week</span>
              </div>
              <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight leading-[1.1] md:text-6xl lg:text-7xl">
                Curated for <span className="text-accent">quality</span>,<br />
                delivered with care.
              </h1>
              <p className="mt-5 max-w-xl text-base text-primary-foreground/65 md:text-lg font-sans leading-relaxed">
                Explore our handpicked collection of premium products across electronics,
                accessories, apparel, and home — designed for everyday delight.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 px-8 text-sm font-semibold shadow-lg shadow-accent/25 transition-all hover:shadow-xl hover:shadow-accent/30 hover:scale-105 font-sans"
                  onClick={() =>
                    document
                      .getElementById("products-section")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Shop Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 px-8 text-sm font-sans"
                  onClick={() =>
                    document
                      .getElementById("products-section")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Explore Collection
                </Button>
              </div>
            </div>

            {/* Right — Promo card */}
            <div className="hidden lg:flex items-center justify-center relative">
              <div className="relative rounded-2xl bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-sm p-10 shadow-2xl shadow-black/20 max-w-md w-full">
                {/* Small icon */}
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                {/* Large serif text */}
                <h2 className="text-4xl font-bold tracking-tight leading-[1.15] text-primary md:text-5xl">
                  Free <span className="text-accent">Shipping</span>,
                </h2>
                <p className="mt-1 text-3xl font-bold tracking-tight text-primary/80 md:text-4xl font-serif">
                  On all orders over $99
                </p>
              </div>

              {/* Decorative sparkle */}
              <svg
                className="absolute -bottom-6 -right-6 h-16 w-16 text-accent/70"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-b border-border bg-card">
        <div className="container mx-auto grid grid-cols-2 gap-0 divide-x divide-border md:grid-cols-4">
          {[
            { icon: Truck, label: "Free Shipping", sub: "On orders over $99" },
            { icon: RotateCcw, label: "30-Day Returns", sub: "Hassle-free refunds" },
            { icon: ShieldCheck, label: "Secure Checkout", sub: "SSL encrypted" },
            { icon: Headphones, label: "24/7 Support", sub: "Always here to help" },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center justify-center gap-3 px-4 py-5 md:py-6">
              <Icon className="h-6 w-6 text-accent flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold font-sans">{label}</p>
                <p className="text-xs text-muted-foreground font-sans">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section id="products-section" className="container mx-auto px-4 py-12 md:py-16">
        {/* Section Header */}
        <div className="mb-2 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Our Collection</h2>
          <p className="mx-auto mt-2 max-w-lg text-muted-foreground font-sans">
            Browse our curated selection of premium products, handpicked for quality and style.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-full pl-10 pr-4 border-border/60 bg-card focus-visible:ring-accent font-sans"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-5 py-2 text-sm font-medium capitalize transition-all font-sans ${
                  category === c
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-card text-muted-foreground border border-border hover:border-accent/40 hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[380px] rounded-2xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-20 text-center">
            <Search className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="text-muted-foreground font-sans">No products match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p, i) => (
              <Card
                key={p.id}
                className="group overflow-hidden rounded-2xl border-border/50 p-0 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-accent/5"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <Link to="/product/$id" params={{ id: p.id }} className="block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = "none";
                          if (target.parentElement) {
                            target.parentElement.classList.add(
                              "bg-gradient-to-br",
                              "from-muted",
                              "to-secondary",
                            );
                            target.parentElement.innerHTML = `<div class="flex h-full w-full items-center justify-center text-muted-foreground text-sm font-sans">${p.name}</div>`;
                          }
                        }}
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-muted to-secondary" />
                    )}

                    {/* Quick Add overlay */}
                    <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center p-4 transition-transform duration-300 group-hover:translate-y-0">
                      <Button
                        size="sm"
                        className="w-full rounded-full bg-primary/90 text-primary-foreground backdrop-blur-sm hover:bg-primary shadow-lg font-sans"
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(p.id);
                        }}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" /> Quick Add
                      </Button>
                    </div>

                    {/* Category badge */}
                    {p.category && (
                      <div className="absolute left-3 top-3">
                        <Badge className="rounded-full bg-card/90 text-foreground backdrop-blur-sm border-0 text-xs font-medium font-sans shadow-sm">
                          {p.category}
                        </Badge>
                      </div>
                    )}
                  </div>
                </Link>
                <div className="space-y-2 p-4">
                  <div className="flex items-center gap-0.5 text-accent">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="h-3 w-3 fill-current" />
                    ))}
                    <span className="ml-1 text-xs text-muted-foreground font-sans">(4.9)</span>
                  </div>
                  <Link to="/product/$id" params={{ id: p.id }}>
                    <h3 className="line-clamp-1 text-sm font-semibold transition-colors group-hover:text-accent font-sans">
                      {p.name}
                    </h3>
                  </Link>
                  <p className="line-clamp-1 text-xs text-muted-foreground font-sans">
                    {p.description}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-lg font-bold font-sans">{formatPrice(p.price)}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter CTA */}
      <section className="bg-secondary/50">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Stay in the Loop</h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground font-sans">
            Subscribe to get early access to new arrivals, exclusive deals, and curated picks.
          </p>
          <div className="mx-auto mt-6 flex max-w-md gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-full border-border/60 bg-card font-sans"
            />
            <Button className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 px-6 font-sans">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
