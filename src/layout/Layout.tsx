import { Outlet } from "react-router";
import Header from "@/components/shared/Header.tsx";
import Footer from "@/components/shared/Footer.tsx";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
