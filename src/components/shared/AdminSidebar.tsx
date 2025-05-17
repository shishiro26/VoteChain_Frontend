import { useState, useEffect } from "react";
import {
  BarChart3,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  Home,
  Medal,
  UserCheck,
  Users,
  Flag,
  LogOut,
  Settings,
  HelpCircle,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Link, useLocation } from "react-router";
import { useWallet } from "@/store/useWallet";

interface AdminSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const AdminSidebar = ({ isOpen, toggleSidebar }: AdminSidebarProps) => {
  const location = useLocation();
  const pathname = location.pathname;
  const { disconnectWallet } = useWallet();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
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
    { name: "Manage Parties", href: "/admin/manage-parties", icon: Flag },
  ];

  const secondaryNavigation = [
    { name: "Settings", href: "/admin/settings", icon: Settings },
    { name: "Help & Support", href: "/admin/help", icon: HelpCircle },
  ];

  return (
    <>
      {isMobile && !isOpen && (
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      <div
        className={cn(
          "h-screen bg-card border-r border-border transition-all duration-300",
          isOpen
            ? isMobile
              ? "fixed w-64"
              : "w-64"
            : isMobile
            ? "w-0 -ml-64"
            : "w-16",
          isMobile && isOpen ? "shadow-xl" : ""
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-border">
            {isOpen ? (
              <Link to="/admin" className="flex items-center">
                <span className="text-xl font-bold text-primary">Admin</span>
              </Link>
            ) : (
              <Link to="/admin" className="flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-primary" />
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-muted-foreground"
            >
              {isOpen ? (
                <ChevronLeft className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <TooltipProvider delayDuration={0}>
              <nav className="space-y-1">
                {navigation.map((item) => (
                  <Tooltip key={item.name}>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.href}
                        className={cn(
                          "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                          pathname === item.href ||
                            (item.href !== "/admin" &&
                              pathname.startsWith(item.href))
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          !isOpen && "justify-center"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-5 w-5 flex-shrink-0",
                            isOpen && "mr-3"
                          )}
                        />
                        {isOpen && <span>{item.name}</span>}
                      </Link>
                    </TooltipTrigger>
                    {!isOpen && (
                      <TooltipContent side="right">{item.name}</TooltipContent>
                    )}
                  </Tooltip>
                ))}
              </nav>
            </TooltipProvider>

            <Separator className="my-4" />

            <TooltipProvider delayDuration={0}>
              <nav className="space-y-1">
                {secondaryNavigation.map((item) => (
                  <Tooltip key={item.name}>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.href}
                        className={cn(
                          "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                          pathname === item.href
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          !isOpen && "justify-center"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-5 w-5 flex-shrink-0",
                            isOpen && "mr-3"
                          )}
                        />
                        {isOpen && <span>{item.name}</span>}
                      </Link>
                    </TooltipTrigger>
                    {!isOpen && (
                      <TooltipContent side="right">{item.name}</TooltipContent>
                    )}
                  </Tooltip>
                ))}
              </nav>
            </TooltipProvider>
          </div>

          <div className="p-4 border-t border-border">
            <div className="space-y-3">
              <Link
                to="/"
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
                  !isOpen && "justify-center"
                )}
              >
                <Home className={cn("h-5 w-5", isOpen && "mr-3")} />
                {isOpen && <span>Back to Main Site</span>}
              </Link>

              <Button
                variant="ghost"
                className={cn(
                  "w-full text-destructive hover:text-destructive hover:bg-destructive/10",
                  isOpen ? "justify-start" : "justify-center"
                )}
                onClick={disconnectWallet}
              >
                <LogOut className={cn("h-5 w-5", isOpen && "mr-3")} />
                {isOpen && <span>Logout</span>}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default AdminSidebar;
