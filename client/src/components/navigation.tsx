import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation } from "wouter";
import { Home, Search, Heart, Settings, LogOut, Menu, User, Shield } from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const navLinks = [
    { href: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
    { href: "/properties", label: "Properties", icon: <Search className="w-4 h-4" /> },
    { href: "/dashboard", label: "Dashboard", icon: <Heart className="w-4 h-4" />, authRequired: true },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  const MobileMenu = () => (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <div className="flex flex-col h-full">
          <div className="py-4">
            <h2 className="text-lg font-semibold font-['Poppins']">PropertyHub</h2>
          </div>
          
          <nav className="flex-1 space-y-2">
            {navLinks.map((link) => {
              if (link.authRequired && !isAuthenticated) return null;
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive(link.href)
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}>
                    {link.icon}
                    <span>{link.label}</span>
                  </div>
                </Link>
              );
            })}
            
            {isAuthenticated && user?.role === "admin" && (
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                <div className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive("/admin")
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}>
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </div>
              </Link>
            )}
          </nav>

          <div className="border-t pt-4">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-3 px-3 py-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.profileImageUrl || ""} />
                    <AvatarFallback>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Button variant="ghost" className="w-full" onClick={handleLogin}>
                  Sign In
                </Button>
                <Button className="w-full" onClick={handleLogin}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <header className="bg-card shadow-sm sticky top-0 z-50 border-b">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-bold font-['Poppins'] text-primary cursor-pointer">
                PropertyHub
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              if (link.authRequired && !isAuthenticated) return null;
              
              return (
                <Link key={link.href} href={link.href}>
                  <span className={`px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                    isActive(link.href)
                      ? "text-primary border-b-2 border-primary"
                      : "text-foreground hover:text-primary"
                  }`}>
                    {link.label}
                  </span>
                </Link>
              );
            })}
            
            {isAuthenticated && user?.role === "admin" && (
              <Link href="/admin">
                <span className={`px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                  isActive("/admin")
                    ? "text-primary border-b-2 border-primary"
                    : "text-foreground hover:text-primary"
                }`}>
                  Admin
                </span>
              </Link>
            )}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.profileImageUrl || ""} />
                      <AvatarFallback>
                        <User className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <Link href="/dashboard">
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                  </Link>
                  {user?.role === "admin" && (
                    <Link href="/admin">
                      <DropdownMenuItem className="cursor-pointer">
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Panel
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" onClick={handleLogin}>
                  Sign In
                </Button>
                <Button onClick={handleLogin}>
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}
