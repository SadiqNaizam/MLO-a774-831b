import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Utensils, ShoppingCart, User, Search, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(2); // Placeholder

  console.log('Header component loaded');

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/restaurant-listing', label: 'Restaurants' },
    { to: '/order-tracking', label: 'Track Order' },
  ];

  const NavLinksComponent: React.FC<{isMobile?: boolean}> = ({ isMobile = false }) => (
    <>
      {navLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `text-sm font-medium transition-colors hover:text-primary ${
              isActive ? 'text-primary font-semibold' : 'text-muted-foreground'
            } ${isMobile ? 'block py-2 px-3 text-base hover:bg-muted rounded-md' : ''}`
          }
          onClick={() => isMobile && setIsMobileMenuOpen(false)}
        >
          {link.label}
        </NavLink>
      ))}
    </>
  );


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo and Desktop Navigation */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
            <Utensils className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">FoodieApp</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <NavLinksComponent />
          </nav>
        </div>

        {/* Search and Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search restaurants..."
              className="pl-8 sm:w-[200px] md:w-[250px] lg:w-[300px]"
            />
          </div>

          <Button variant="ghost" size="icon" asChild>
            <Link to="/cart" aria-label="View Cart">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {cartItemCount}
                </Badge>
              )}
              <span className="sr-only">View Cart</span>
            </Link>
          </Button>

          <Button variant="ghost" size="icon" asChild>
            <Link to="/user-profile" aria-label="User Profile">
              <User className="h-5 w-5" />
              <span className="sr-only">User Profile</span>
            </Link>
          </Button>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs sm:max-w-sm">
                <SheetHeader className="flex flex-row justify-between items-center mb-4">
                  <SheetTitle className="flex items-center gap-2">
                    <Utensils className="h-6 w-6 text-primary" />
                    <span className="font-bold text-lg">FoodieApp</span>
                  </SheetTitle>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </SheetHeader>
                <div className="relative my-4">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search restaurants..."
                    className="pl-8 w-full"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setIsMobileMenuOpen(false);
                    }}
                  />
                </div>
                <nav className="flex flex-col gap-2">
                  <NavLinksComponent isMobile={true} />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;