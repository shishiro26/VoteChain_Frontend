import { useState, useEffect } from "react";
import { Link } from "react-router";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  Home,
  Medal,
  UserCheck,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  // Auto-collapse on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: BarChart3 },
    {
      name: "Create Election",
      href: "/admin/create-election",
      icon: CalendarPlus,
    },
    { name: "Approve Users", href: "/admin/approve-users", icon: UserCheck },
    { name: "Add Candidates", href: "/admin/add-candidates", icon: Users },
    { name: "Declare Results", href: "/admin/declare-results", icon: Medal },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-sidebar-background border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        {!collapsed && (
          <Link to="/admin" className="flex items-center">
            <span className="text-xl font-bold text-primary">
              Admin Dashboard
            </span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-sidebar-foreground"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          <TooltipProvider delayDuration={0}>
            {navigation.map((item) => (
              <Tooltip key={item.name}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname === item.href ||
                        (item.href !== "/" && pathname.startsWith(item.href))
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                      collapsed && "justify-center"
                    )}
                  >
                    <item.icon
                      className={cn("h-5 w-5", collapsed ? "" : "mr-3")}
                    />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">{item.name}</TooltipContent>
                )}
              </Tooltip>
            ))}
          </TooltipProvider>
        </nav>
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/"
                className={cn(
                  "w-full flex items-center text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground h-9 px-3 rounded-md",
                  collapsed && "justify-center"
                )}
              >
                <Home className={cn("h-5 w-5", collapsed ? "" : "mr-2")} />
                {!collapsed && <span>Back to Main Site</span>}
              </Link>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">Back to Main Site</TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default AdminSidebar;
