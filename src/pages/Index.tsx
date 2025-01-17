import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CreditCard, Users, FileText, Building2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
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
    },
    {
      title: "Banks",
      value: banksCount || 0,
      icon: Building2,
      description: "Registered banking institutions",
    },
    {
      title: "Articles",
      value: articlesCount || 0,
      icon: FileText,
      description: "Published blog articles",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Dashboard Overview</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Welcome to your credit card management dashboard
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <stat.icon className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <h2 className="text-3xl font-bold">{stat.value}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              • Manage credit cards and their benefits
            </p>
            <p className="text-sm text-muted-foreground">
              • Update bank information and partnerships
            </p>
            <p className="text-sm text-muted-foreground">
              • Create and publish blog articles
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">System Status</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <p className="text-sm text-muted-foreground">All systems operational</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <p className="text-sm text-muted-foreground">Database connected</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <p className="text-sm text-muted-foreground">API services active</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Index;