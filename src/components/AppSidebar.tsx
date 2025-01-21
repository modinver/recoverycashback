import { FileText, Tags, Users, Building2, CreditCard, Home, HelpCircle, Search, Settings2, FileJson } from "lucide-react";
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
import { useState } from "react";

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
    title: "Web Pages",
    icon: FileText,
    path: "/admin/webpages",
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
  {
    title: "SEO",
    icon: Search,
    description: "Search Engine Optimization",
    submenu: [
      {
        title: "Robots.txt",
        icon: FileJson,
        path: "/admin/seo/robots",
        description: "Configure robots.txt"
      },
      {
        title: "Sitemap",
        icon: Settings2,
        path: "/admin/seo/sitemap",
        description: "Manage XML sitemap"
      }
    ]
  }
];

export function AppSidebar() {
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const getIconColor = (title: string) => {
    const colors: { [key: string]: string } = {
      'Dashboard': 'blue',
      'Credit Cards': 'indigo',
      'Banks': 'purple',
      'Web Pages': 'rose',
      'Tags': 'orange',
      'Authors': 'amber',
      'FAQs': 'emerald',
      'SEO': 'cyan'
    };
    return colors[title] || 'gray';
  };

  const renderMenuItem = (item: typeof menuItems[0]) => {
    const isExpanded = expandedItems.includes(item.title);

    if ('submenu' in item && item.submenu) {
      return (
        <SidebarMenuItem key={item.title} className="flex flex-col mb-4">
          <div
            onClick={() => toggleExpanded(item.title)}
            className="w-full px-3 py-3 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-lg cursor-pointer relative group border-b border-gray-100 dark:border-gray-800"
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 shadow-sm group-hover:shadow-md transition-all duration-200">
                <item.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 block">
                  {item.title}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 block whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.description}
                </span>
              </div>
            </div>
          </div>
          {isExpanded && (
            <div className="ml-11 mt-3 space-y-2">
              {item.submenu.map((subItem) => (
                <SidebarMenuButton
                  key={subItem.title}
                  onClick={() => navigate(subItem.path)}
                  className="group w-full px-3 py-2 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-lg transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <subItem.icon className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 whitespace-nowrap overflow-hidden text-ellipsis">
                      {subItem.title}
                    </span>
                  </div>
                </SidebarMenuButton>
              ))}
            </div>
          )}
        </SidebarMenuItem>
      );
    }

    return (
      <SidebarMenuItem key={item.title} className="mb-4">
        <SidebarMenuButton
          onClick={() => navigate(item.path)}
          className="group w-full px-3 py-3 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-lg transition-all duration-200 relative border-b border-gray-100 dark:border-gray-800"
        >
          <div className="flex items-center gap-3">
            <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-${getIconColor(item.title)}-50 to-${getIconColor(item.title)}-100 dark:from-${getIconColor(item.title)}-900/20 dark:to-${getIconColor(item.title)}-800/20 shadow-sm group-hover:shadow-md transition-all duration-200`}>
              <item.icon className={`w-5 h-5 text-${getIconColor(item.title)}-600 dark:text-${getIconColor(item.title)}-400`} />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 block">
                {item.title}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 block whitespace-nowrap overflow-hidden text-ellipsis">
                {item.description}
              </span>
            </div>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar>
      <SidebarContent className="py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 mb-6 text-lg font-semibold text-gray-800 dark:text-gray-200">
            Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-4 space-y-6">
              {menuItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}