import * as React from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useNavigate, useLocation } from 'react-router-dom';
import { UserCircle, Menu, X, LogIn, UserPlus, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/common/Logo";
import { motion, AnimatePresence } from "framer-motion";

export const NavMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    { label: 'CashBack', path: '/cashback' },
    { label: 'Best CashBack Cards UAE 2025', path: '/best-cashback-credit-cards-uae' },
    { label: 'Credit Card', path: '/credit-cards' },
    { label: 'Loans', path: '/loans' },
    { label: 'Banks', path: '/banks' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed top-0 z-50">
      <div className="container mx-auto px-4">
        <NavigationMenu.Root className="relative flex h-16 items-center justify-between">
          <motion.div 
            className="flex-shrink-0 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
          >
            <Logo />
          </motion.div>

          <motion.button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-6 w-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <div className="hidden md:flex md:items-center md:space-x-6">
            <NavigationMenu.List className="flex gap-6">
              {menuItems.map((item) => (
                <NavigationMenu.Item key={item.path}>
                  <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                    <NavigationMenu.Link
                      className={cn(
                        "relative text-sm font-medium transition-colors hover:text-foreground",
                        "cursor-pointer py-2 group",
                        isActive(item.path) ? "text-foreground" : "text-muted-foreground"
                      )}
                      onClick={() => navigate(item.path)}
                    >
                      {item.label}
                      <span className="absolute left-0 bottom-0 w-full h-0.5 bg-foreground transform origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100" />
                      {isActive(item.path) && (
                        <motion.div
                          className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-foreground"
                          layoutId="activeIndicator"
                        />
                      )}
                    </NavigationMenu.Link>
                  </motion.div>
                </NavigationMenu.Item>
              ))}
            </NavigationMenu.List>

            <div className="flex items-center gap-3">
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_100%] animate-gradient text-white hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 group"
                  >
                    <span>Account</span>
                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                  </motion.button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                    sideOffset={5}
                  >
                    <DropdownMenu.Item
                      className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                      onClick={() => navigate('/login')}
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      <span>Login</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                      onClick={() => navigate('/register')}
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      <span>Register</span>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/admin')}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10"
                aria-label="Admin panel"
              >
                <UserCircle className="h-5 w-5" />
              </motion.button>
            </div>
          </div>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg md:hidden"
              >
                <div className="px-4 py-3 space-y-3">
                  {menuItems.map((item) => (
                    <motion.a
                      key={item.path}
                      className={cn(
                        "block px-3 py-2 rounded-md text-base font-medium",
                        isActive(item.path)
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      )}
                      onClick={() => {
                        navigate(item.path);
                        setIsMenuOpen(false);
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {item.label}
                    </motion.a>
                  ))}
                  <div className="flex flex-col gap-3 pt-3 border-t border-border">
                    <div className="grid grid-cols-2 gap-2">
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          navigate('/login');
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_100%] animate-gradient text-white hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300"
                      >
                        <LogIn className="h-4 w-4" />
                        <span>Login</span>
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          navigate('/register');
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-md text-base font-medium border border-border hover:bg-accent"
                      >
                        <UserPlus className="h-4 w-4" />
                        <span>Register</span>
                      </motion.button>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        navigate('/admin');
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-center px-3 py-2 rounded-md text-base font-medium border border-border hover:bg-accent"
                    >
                      Admin Panel
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </NavigationMenu.Root>
      </div>
    </div>
  );
};
