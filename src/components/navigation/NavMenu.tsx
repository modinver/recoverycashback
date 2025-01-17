import * as React from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { useNavigate } from 'react-router-dom';
import { UserCircle, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/common/Logo";

export const NavMenu = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    { label: 'CashBack', path: '/cashback' },
    { label: 'Credit Card', path: '/credit-cards' },
    { label: 'Loans', path: '/loans' },
    { label: 'Banks', path: '/banks' },
  ];

  return (
    <div className="w-full border-b bg-white/80 backdrop-blur-sm fixed top-0 z-50">
      <div className="container mx-auto px-2 sm:px-4">
        <NavigationMenu.Root className="relative flex h-14 sm:h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
            <Logo />
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden inline-flex items-center justify-center p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <NavigationMenu.List className="flex gap-6">
              {menuItems.map((item) => (
                <NavigationMenu.Item key={item.path}>
                  <NavigationMenu.Link
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      "cursor-pointer"
                    )}
                    onClick={() => navigate(item.path)}
                  >
                    {item.label}
                  </NavigationMenu.Link>
                </NavigationMenu.Item>
              ))}
            </NavigationMenu.List>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/admin')}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10"
                aria-label="Admin panel"
              >
                <UserCircle className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-white border-b shadow-lg md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {menuItems.map((item) => (
                  <a
                    key={item.path}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => {
                      navigate(item.path);
                      setIsMenuOpen(false);
                    }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </NavigationMenu.Root>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="flex flex-col gap-2 px-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  navigate('/login');
                  setIsMenuOpen(false);
                }}
                className="w-full text-center px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
              >
                Login
              </button>
              <button
                onClick={() => {
                  navigate('/admin');
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-gray-50"
              >
                Admin Panel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
