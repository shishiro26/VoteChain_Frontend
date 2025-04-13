import { Link, Outlet } from "react-router";
import Header from "@/components/shared/Header.tsx";
import Footer from "@/components/shared/Footer.tsx";
import { useWallet } from "@/store/useWallet";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import React from "react";

const Layout = () => {
  const { is_profile_complete } = useWallet();

  React.useEffect(() => {
    if (!is_profile_complete) {
      toast.message(
        "Please complete your profile to continue using the application",
        {
          description: (
            <Button type="button" variant={"link"} asChild>
              <Link to={"/update-profile"}>Update Profile</Link>
            </Button>
          ),
        }
      );
    }
  }, [is_profile_complete]);
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
