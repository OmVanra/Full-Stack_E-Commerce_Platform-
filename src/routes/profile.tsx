import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { ShieldCheck, Mail, Calendar } from "lucide-react";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, profile, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  if (!user) return null;

  const initials = (profile?.full_name || user.email || "U").slice(0, 2).toUpperCase();

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Profile</h1>
      <p className="mb-8 text-muted-foreground font-sans">Manage your account details</p>

      <Card className="rounded-2xl p-8 border-border/50">
        <div className="flex items-center gap-5">
          <Avatar className="h-20 w-20 ring-4 ring-accent/20">
            <AvatarImage src={profile?.avatar_url ?? undefined} />
            <AvatarFallback className="bg-accent text-accent-foreground text-xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold font-sans">{profile?.full_name ?? "Unnamed"}</h2>
            <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground font-sans">
              <Mail className="h-3.5 w-3.5" />
              {user.email}
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium font-sans">
              {isAdmin ? <ShieldCheck className="h-3.5 w-3.5 text-accent" /> : null}
              {isAdmin ? "Admin" : "Member"}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 border-t border-border pt-6">
          <div className="flex items-center gap-3 text-sm font-sans">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Member since</span>
            <span className="font-medium">
              {new Date(user.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
