import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Gem } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) navigate({ to: "/" });
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else toast.success("Welcome back!");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { full_name: fullName },
      },
    });
    setLoading(false);
    if (error) setError(error.message);
    else toast.success("Account created — check your email if confirmation is required.");
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center px-4 py-10">
      <div className="mx-auto grid w-full max-w-4xl gap-0 overflow-hidden rounded-3xl border border-border/50 shadow-2xl shadow-accent/5 lg:grid-cols-2">
        {/* Left panel — Brand */}
        <div className="hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Gem className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight font-serif">Velora</span>
            </div>
            <h2 className="mt-10 text-3xl font-bold leading-tight">
              Premium products,
              <br />
              <span className="text-accent">curated for you.</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-primary-foreground/60 font-sans">
              Join thousands of customers who trust Velora for quality electronics, accessories,
              apparel, and home goods.
            </p>
          </div>
          <div className="space-y-3 text-xs text-primary-foreground/40 font-sans">
            <div className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-accent" />
              Free shipping on orders over $99
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-accent" />
              30-day hassle-free returns
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-accent" />
              Secure checkout with SSL encryption
            </div>
          </div>
        </div>

        {/* Right panel — Form */}
        <div className="bg-card p-8 lg:p-12">
          <div className="mb-8 lg:hidden text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg shadow-accent/20">
              <Gem className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold">Welcome to Velora</h1>
            <p className="mt-1 text-sm text-muted-foreground font-sans">
              Sign in or create an account
            </p>
          </div>

          <div className="hidden lg:block mb-8">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="mt-1 text-sm text-muted-foreground font-sans">
              Sign in to your account to continue
            </p>
          </div>

          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2 rounded-full bg-secondary">
              <TabsTrigger value="login" className="rounded-full font-sans text-sm">
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="rounded-full font-sans text-sm">
                Sign up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="font-sans text-sm">Email</Label>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl font-sans"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-sans text-sm">Password</Label>
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-xl font-sans"
                  />
                </div>
                {error && <p className="text-sm text-destructive font-sans">{error}</p>}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90 font-sans"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-6">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="font-sans text-sm">Full name</Label>
                  <Input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="rounded-xl font-sans"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-sans text-sm">Email</Label>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl font-sans"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-sans text-sm">Password</Label>
                  <Input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-xl font-sans"
                  />
                </div>
                {error && <p className="text-sm text-destructive font-sans">{error}</p>}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90 font-sans"
                >
                  {loading ? "Creating..." : "Create account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
