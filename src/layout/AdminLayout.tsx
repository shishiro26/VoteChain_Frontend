import { useEffect, useState } from "react";

import { AlertTriangle, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/store/useWallet";
import { Outlet, useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { Loader } from "@/components/ui/loader";
import AdminSidebar from "@/components/shared/AdminSidebar";

export default function AdminLayout() {
  const { walletAddress } = useWallet();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { checkIsAdmin } = useAuth();

  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [isSidebarOpen]);

  useEffect(() => {
    const checkAuthorization = async () => {
      if (!walletAddress) {
        navigate("/");
        return;
      }

      setIsAuthorized(checkIsAdmin);

      if (!checkIsAdmin) {
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    };

    checkAuthorization();
  }, [walletAddress, navigate, checkIsAdmin]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (isAuthorized === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader size="lg" />
          <p className="mt-4 text-muted-foreground">
            Verifying admin access...
          </p>
        </div>
      </div>
    );
  }

  if (isAuthorized === false) {
    return (
      <div className="flex items-center justify-center bg-background">
        <div className="max-w-md text-center p-6 rounded-lg border shadow-sm">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Unauthorized Access</h1>
          <p className="text-muted-foreground mb-6">
            You do not have permission to access the admin dashboard. You will
            be redirected to the home page.
          </p>
          <Button onClick={() => navigate("/")} variant="default">
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-background">
      <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-6">
          {!isSidebarOpen && (
            <Button
              variant="outline"
              size="icon"
              onClick={toggleSidebar}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
