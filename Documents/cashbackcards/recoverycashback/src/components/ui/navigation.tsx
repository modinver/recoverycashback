import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Landmark,
  Building2,
  DollarSign,
  Shield,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const menuItems = [
    {
      title: "CashBack Cards",
      icon: DollarSign,
      path: "/cashback-cards"
    },
    {
      title: "Loans",
      icon: Landmark,
      path: "/loans"
    },
    {
      title: "Credit Cards",
      icon: CreditCard,
      path: "/credit-cards"
    },
    {
      title: "Banks",
      icon: Building2,
      path: "/banks"
    },
    {
      title: "Insurance",
      icon: Shield,
      path: "/insurance"
    }
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/logo.svg"
              alt="RecoveryCashback"
              className="h-8 w-auto mr-2"
            />
            <span className="text-xl font-bold text-purple-600 dark:text-purple-400 hidden sm:inline">
              RecoveryCashback
            </span>
          </Link>

          {/* Mobile menu button */}
          {isMobile && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          )}

          {/* Desktop Navigation */}
          <div className={`hidden md:flex items-center space-x-2`}>
            {menuItems.map((item) => (
              <Link key={item.title} to={item.path}>
                <Button variant="ghost" className="flex items-center gap-2">
                  <item.icon className="w-4 h-4" />
                  <span>{item.title}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobile && isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              {menuItems.map((item) => (
                <Link key={item.title} to={item.path}>
                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-start gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}