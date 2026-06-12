import { Link, useNavigate } from "@tanstack/react-router";
import {
  ShoppingCart,
  User,
  LogOut,
  Package,
  LayoutDashboard,
  Menu,
  X,
  Gem,
  Truck,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export function Header() {
  const { user, profile, isAdmin, signOut } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  const initials = (profile?.full_name || user?.email || "U").slice(0, 2).toUpperCase();

  return (
    <>
      {/* Main Header */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl backdrop-saturate-150">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent/80 text-accent-foreground shadow-md transition-transform group-hover:scale-110">
              <Gem className="h-4 w-4" />
            </div>
            <span className="text-xl font-bold tracking-tight font-serif">Velora</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            <NavLink to="/">Shop</NavLink>
            {user && <NavLink to="/orders">Orders</NavLink>}
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="relative px-4 py-2 text-sm font-medium text-accent transition-colors hover:text-accent/80 font-sans"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-1.5">
            {user && (
              <Button asChild variant="ghost" size="icon" className="relative">
                <Link to="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  {count > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground shadow-sm animate-pulse-soft">
                      {count}
                    </span>
                  )}
                </Link>
              </Button>
            )}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 px-2">
                    <Avatar className="h-8 w-8 ring-2 ring-accent/20">
                      <AvatarImage src={profile?.avatar_url ?? undefined} />
                      <AvatarFallback className="bg-accent text-accent-foreground text-xs font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden text-sm font-medium sm:inline font-sans">
                      {profile?.full_name ?? "Account"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="font-medium">{profile?.full_name ?? "Account"}</div>
                    <div className="truncate text-xs font-normal text-muted-foreground">
                      {user.email}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders">
                      <Package className="mr-2 h-4 w-4" /> My Orders
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin/dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" /> Admin
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                asChild
                size="sm"
                className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 px-5 font-sans"
              >
                <Link to="/auth">Sign in</Link>
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        {open && (
          <div className="border-t border-border bg-background md:hidden animate-fade-up">
            <div className="container mx-auto flex flex-col px-4 py-3">
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm font-medium font-sans"
              >
                Shop
              </Link>
              {user && (
                <Link
                  to="/orders"
                  onClick={() => setOpen(false)}
                  className="py-2.5 text-sm font-medium font-sans"
                >
                  Orders
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setOpen(false)}
                  className="py-2.5 text-sm font-medium text-accent font-sans"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}

function NavLink({ to, children }: { to: "/" | "/orders"; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="relative px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground font-sans after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-accent after:transition-all hover:after:w-5"
      activeProps={{
        className:
          "relative px-4 py-2 text-sm font-medium text-foreground font-sans after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-5 after:-translate-x-1/2 after:rounded-full after:bg-accent",
      }}
    >
      {children}
    </Link>
  );
}
