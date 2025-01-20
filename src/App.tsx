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
import { LogOut, User } from "lucide-react";
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
import FAQs from "./pages/FAQs";
import Webpages from "./pages/Webpages";
import DynamicPage from "./pages/DynamicPage";
import Robots from "./pages/admin/SEO/Robots";
import RobotsTxt from "./pages/RobotsTxt";

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

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <User className="h-4 w-4" />
        <span>{email}</span>
      </div>
      <Button variant="ghost" size="icon" onClick={handleLogout}>
        <LogOut className="h-4 w-4" />
      </Button>
      <ThemeToggle />
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
            <Route path="/robots.txt" element={<RobotsTxt />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/" element={<Home />} />
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
                          <Route path="/webpages" element={<Webpages />} />
                          <Route path="/seo/robots" element={<Robots />} />
                        </Routes>
                      </main>
                    </div>
                  </SidebarProvider>
                </AuthGuard>
              }
            />
            <Route path="/:slug" element={<DynamicPage />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
