import { Link, useNavigate, useLocation } from "react-router-dom";
import { Compass, LogOut, Home, Map, ClipboardList, Bookmark, MessageSquare, Shield, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { getCurrentUser, logoutUser } from "@/services/storageService";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  requiresAuth?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", path: "/", icon: <Home className="h-4 w-4" /> },
  { label: "Career Matches", path: "/results", icon: <Compass className="h-4 w-4" />, requiresAuth: true },
  { label: "Learning Roadmap", path: "/roadmap", icon: <Map className="h-4 w-4" />, requiresAuth: true },
  { label: "Assessment", path: "/assessment", icon: <ClipboardList className="h-4 w-4" />, requiresAuth: true },
  { label: "Bookmarks", path: "/bookmarks", icon: <Bookmark className="h-4 w-4" />, requiresAuth: true },
  { label: "Feedback", path: "/feedback", icon: <MessageSquare className="h-4 w-4" />, requiresAuth: true },
  { label: "Privacy", path: "/privacy", icon: <Shield className="h-4 w-4" /> },
];

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    setMobileOpen(false);
    navigate("/");
  };

  const visibleItems = NAV_ITEMS.filter((item) => !item.requiresAuth || user);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <Compass className="h-6 w-6 text-primary" />
          <span className="text-gradient">CareerCompass</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {visibleItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                isActive(item.path)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-muted-foreground">
                <User className="inline h-4 w-4 mr-1" />
                {user.name}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="hidden lg:flex">
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </>
          ) : (
            <Button size="sm" className="gradient-primary text-primary-foreground" onClick={() => navigate("/auth")}>
              Get Started
            </Button>
          )}

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col gap-1 mt-8">
                {visibleItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                      isActive(item.path)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
                {user && (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-all mt-4"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
