
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Share2 } from 'lucide-react';
import { useState, useEffect } from 'react';

// Mock auth hook - in a real app, this would come from a context or auth library
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // This is just for demonstration. In a real app, you would check a token, etc.
    // For now, we simulate the user being logged out initially.
    // To test logged-in state, you could use localStorage or a simple toggle.
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsAuthenticated(loggedIn);
  }, []);

  const login = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsAuthenticated(true);
    window.dispatchEvent(new Event("storage")); // to notify other components
  };

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsAuthenticated(false);
    window.dispatchEvent(new Event("storage"));
  };
  
  // This is a hacky way to re-render when auth state changes in another tab
  useEffect(() => {
    const onStorage = () => {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        setIsAuthenticated(loggedIn);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);


  return { isAuthenticated, login, logout };
};

export function Header() {
  const { isAuthenticated, logout } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const navLinks = [
    { href: '/', label: 'Home' },
    ...(isAuthenticated ? [
      { href: '/swaps', label: 'Swaps' },
      { href: '/profile/edit', label: 'Profile' },
    ] : [])
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const handleLogoutClick = () => {
    logout();
    setMobileMenuOpen(false);
  }

  return (
    <header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Share2 className="h-7 w-7 text-primary" />
          <span className="text-xl font-headline font-bold text-foreground">SkillSwap Connect</span>
        </Link>

        {isClient && (
          <>
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <Button onClick={logout} variant="outline">Logout</Button>
              ) : (
                <Button asChild>
                  <Link href="/login">Login</Link>
                </Button>
              )}
            </div>
          </>
        )}


        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background">
              <div className="flex flex-col gap-6 p-6">
                <Link href="/" onClick={handleLinkClick} className="flex items-center gap-2">
                    <Share2 className="h-6 w-6 text-primary" />
                    <span className="font-bold font-headline">SkillSwap Connect</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {navLinks.map(link => (
                    <Link key={link.href} href={link.href} onClick={handleLinkClick} className="text-base font-medium text-muted-foreground transition-colors hover:text-primary">
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="border-t pt-6">
                  {isAuthenticated ? (
                    <Button onClick={handleLogoutClick} variant="outline" className="w-full">Logout</Button>
                  ) : (
                    <Button asChild className="w-full">
                      <Link href="/login" onClick={handleLinkClick}>Login</Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
