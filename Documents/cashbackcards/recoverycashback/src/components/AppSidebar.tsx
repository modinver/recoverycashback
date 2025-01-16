import { CreditCard, Building2, FileText, Settings, Tags, Users, Home, LogOut, HelpCircle, FileJson } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    path: "/admin",
    description: "Overview and statistics"
  },
  {
    title: "Credit Cards",
    icon: CreditCard,
    path: "/admin/credit-cards",
    description: "Manage credit card offerings"
  },
  {
    title: "Banks",
    icon: Building2,
    path: "/admin/banks",
    description: "Banking institutions"
  },
  {
    title: "Blog Articles",
    icon: FileText,
    path: "/admin/articles",
    description: "Content management"
  },
  {
    title: "Pages",
    icon: FileText,
    path: "/admin/pages",
    description: "Static pages management"
  },
  {
    title: "Tags",
    icon: Tags,
    path: "/admin/tags",
    description: "Article categorization"
  },
  {
    title: "Authors",
    icon: Users,
    path: "/admin/authors",
    description: "Content creators"
  },
  {
    title: "FAQs",
    icon: HelpCircle,
    path: "/admin/faqs",
    description: "Manage frequently asked questions"
  },
];

export function AppSidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => navigate(item.path)}
                    className="group relative flex items-center gap-2 hover:bg-sidebar-accent transition-colors duration-200"
                  >
                    <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <div className="flex flex-col">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-xs text-muted-foreground hidden group-hover:block transition-all">
                        {item.description}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {/* Logout Button */}
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={handleLogout}
                  className="group relative flex items-center gap-2 hover:bg-destructive/10 text-destructive hover:text-destructive transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}