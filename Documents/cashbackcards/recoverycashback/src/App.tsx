import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AuthGuard } from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, User, LogIn } from "lucide-react";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "@/components/ThemeToggle";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/Dashboard";
import Banks from "./pages/Banks";
import CreditCards from "./pages/CreditCards";
import Articles from "./pages/Articles";
import Tags from "./pages/Tags";
import Authors from "./pages/Authors";
import Article from "./pages/Article";
import FAQs from "./pages/FAQs";

const UserProfile = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email);
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (!email) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/auth/login")}
        className="gap-2"
      >
        <LogIn className="h-4 w-4" />
        Login
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <User className="h-4 w-4" />
        <span>{email}</span>
      </div>
      <ThemeToggle />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/auth/login")}
        className="gap-2"
      >
        <LogIn className="h-4 w-4" />
        Login
      </Button>
    </div>
  );
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/" element={
              <div className="min-h-screen flex w-full">
                <main className="flex-1">
                  <div className="flex justify-end items-center p-4">
                    <UserProfile />
                  </div>
                  <Home />
                </main>
              </div>
            } />
            <Route path="/:slug" element={
              <div className="min-h-screen flex w-full">
                <main className="flex-1">
                  <div className="flex justify-end items-center p-4">
                    <UserProfile />
                  </div>
                  <Article />
                </main>
              </div>
            } />
            <Route
              path="/admin/*"
              element={
                <AuthGuard>
                  <SidebarProvider>
                    <div className="min-h-screen flex w-full">
                      <AppSidebar />
                      <main className="flex-1 p-6">
                        <div className="flex justify-between items-center mb-4">
                          <SidebarTrigger />
                          <UserProfile />
                        </div>
                        <Routes>
                          <Route index element={<Dashboard />} />
                          <Route path="/banks" element={<Banks />} />
                          <Route path="/credit-cards" element={<CreditCards />} />
                          <Route path="/articles" element={<Articles />} />
                          <Route path="/tags" element={<Tags />} />
                          <Route path="/authors" element={<Authors />} />
                          <Route path="/faqs" element={<FAQs />} />
                        </Routes>
                      </main>
                    </div>
                  </SidebarProvider>
                </AuthGuard>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
