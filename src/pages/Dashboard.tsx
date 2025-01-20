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
            className="relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
            onClick={() => navigate(stat.link)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-gray-800/50 dark:to-transparent"></div>
            <div className="relative p-6 flex items-center space-x-4">
              <div className={`flex-shrink-0 p-4 rounded-xl ${stat.color}`}>
                <stat.icon className="w-10 h-10" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {stat.description}
                </p>
              </div>
              <ArrowUpRight className="w-6 h-6 text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300 transition-colors" />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
              <span>Quick Actions</span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 group cursor-pointer">
                <div className="w-3 h-3 rounded-full bg-purple-500 shadow-lg shadow-purple-500/20"></div>
                <p className="text-sm text-gray-600 dark:text-gray-300 group-hover:translate-x-1 transition-transform">
                  Manage credit cards and their benefits
                </p>
              </div>
              <div className="flex items-center space-x-3 group cursor-pointer">
                <div className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/20"></div>
                <p className="text-sm text-gray-600 dark:text-gray-300 group-hover:translate-x-1 transition-transform">
                  Update bank information and partnerships
                </p>
              </div>
              <div className="flex items-center space-x-3 group cursor-pointer">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20"></div>
                <p className="text-sm text-gray-600 dark:text-gray-300 group-hover:translate-x-1 transition-transform">
                  Create and publish blog articles
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
              <span>System Status</span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 group">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20 animate-pulse"></div>
                <p className="text-sm text-gray-600 dark:text-gray-300 group-hover:translate-x-1 transition-transform">
                  All systems operational
                </p>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20 animate-pulse"></div>
                <p className="text-sm text-gray-600 dark:text-gray-300 group-hover:translate-x-1 transition-transform">
                  Database connected
                </p>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20 animate-pulse"></div>
                <p className="text-sm text-gray-600 dark:text-gray-300 group-hover:translate-x-1 transition-transform">
                  API services active
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;