import { Card } from "@/components/ui/card";
import { CreditCard, Users, FileText, Building2, ArrowUpRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  
  const { data: creditCardsCount } = useQuery({
    queryKey: ["creditCardsCount"],
    queryFn: async () => {
      const { count } = await supabase
        .from("credit_cards")
        .select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: banksCount } = useQuery({
    queryKey: ["banksCount"],
    queryFn: async () => {
      const { count } = await supabase
        .from("banks")
        .select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const { data: articlesCount } = useQuery({
    queryKey: ["articlesCount"],
    queryFn: async () => {
      const { count } = await supabase
        .from("blog_articles")
        .select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const stats = [
    {
      title: "Credit Cards",
      value: creditCardsCount || 0,
      icon: CreditCard,
      description: "Total credit cards in the system",
      color: "bg-gradient-to-br from-purple-500/10 to-purple-500/20 text-purple-600",
      link: "/admin/credit-cards"
    },
    {
      title: "Banks",
      value: banksCount || 0,
      icon: Building2,
      description: "Registered banking institutions",
      color: "bg-gradient-to-br from-blue-500/10 to-blue-500/20 text-blue-600",
      link: "/admin/banks"
    },
    {
      title: "Articles",
      value: articlesCount || 0,
      icon: FileText,
      description: "Published blog articles",
      color: "bg-gradient-to-br from-emerald-500/10 to-emerald-500/20 text-emerald-600",
      link: "/admin/articles"
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent dark:from-gray-100 dark:to-gray-300">
            Dashboard Overview
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Welcome to your credit card management dashboard
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card 
            key={stat.title} 
            className="relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
            onClick={() => navigate(stat.link)}
          >
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <h2 className="text-3xl font-bold">{stat.value}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 hover:shadow-lg transition-all duration-300">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></span>
            Quick Actions
          </h3>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
              Manage credit cards and their benefits
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Update bank information and partnerships
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Create and publish blog articles
            </p>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all duration-300">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></span>
            System Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-sm text-muted-foreground">All systems operational</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-sm text-muted-foreground">Database connected</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-sm text-muted-foreground">API services active</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;