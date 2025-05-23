import { Outlet, useLocation, useNavigate } from "react-router";
import Header from "@/components/shared/Header.tsx";
import Footer from "@/components/shared/Footer.tsx";
import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetProfileDetailsByWalletId } from "@/api";
import { useWallet } from "@/store/useWallet";
import React from "react";

const Layout = () => {
  const { isAuthenticated } = useAuth();
  const { walletAddress, isProfileComplete, profile, setProfile } = useWallet();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const { data } = useGetProfileDetailsByWalletId(
    walletAddress || "",
    isProfileComplete,
    Boolean(profile)
  );

  React.useEffect(() => {
    if (data) {
      setProfile(data);
    }
  }, [data, setProfile]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {isAuthenticated || pathname === "/" ? (
        <Outlet />
      ) : (
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Wallet Not Connected</CardTitle>
              <CardDescription>
                Please connect your MetaMask wallet to update your profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/")} className="w-full">
                Go to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Layout;
