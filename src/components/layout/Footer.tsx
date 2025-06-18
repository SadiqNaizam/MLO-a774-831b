import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ListOrdered, UserCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils'; // Assuming utils.ts exists for cn

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/order-tracking', label: 'Orders', icon: ListOrdered },
  { href: '/user-profile', label: 'Profile', icon: UserCircle2 },
];

const informationalLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact Us' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/privacy', label: 'Privacy Policy' },
];

const Footer: React.FC = () => {
  const location = useLocation();
  console.log('Footer loaded');

  return (
    <>
      {/* Mobile Tab Bar */}
      <footer className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
        <nav className="flex h-16 items-center justify-around">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link to={item.href} key={item.label} className="flex-1">
                <Button
                  variant="ghost"
                  className={cn(
                    "flex h-full w-full flex-col items-center justify-center gap-1 rounded-none p-0 text-xs",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "")} />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>
      </footer>
      {/* Spacer for mobile fixed footer */}
      <div className="h-16 md:hidden" />


      {/* Desktop Footer */}
      <footer className="hidden border-t bg-muted/40 py-8 md:block">
        <div className="container mx-auto flex flex-col items-center justify-between px-4 md:flex-row">
          <div className="mb-4 text-center text-sm text-muted-foreground md:mb-0 md:text-left">
            &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
          </div>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {informationalLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href} // These are placeholder links; actual pages would need to be created
                className="text-sm text-muted-foreground hover:text-primary hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </>
  );
};

export default Footer;