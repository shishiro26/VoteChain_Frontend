import { Outlet, useNavigate } from "react-router";
import AdminSidebar from "@/components/shared/AdminSidebar";
import { useWallet } from "@/store/useWallet";
import React from "react";

const AdminLayout = () => {
  const { wallet, role } = useWallet();
  const navigate = useNavigate();
  const is_admin = role === "admin";

  React.useEffect(() => {
    if (!is_admin || !wallet) {
      navigate("/");
    }
  }, [is_admin, wallet, navigate]);

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
