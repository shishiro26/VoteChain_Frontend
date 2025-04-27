import { Navigate, Route, Routes } from "react-router";
import Home from "./page.tsx";
import Layout from "@/layout/Layout.tsx";
import AdminLayout from "@/layout/AdminLayout.tsx";
import UpdateProfile from "@/pages/update-profile.tsx";
import ApproveUsersPage from "@/pages/approve-users.tsx";
import { useWallet } from "@/store/useWallet.ts";
import ProfilePage from "@/pages/profile.tsx";
import NotFound from "@/components/shared/not-found.tsx";

function App() {
  const { is_profile_complete } = useWallet();
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route
          path="/update-profile"
          element={
            is_profile_complete ? <Navigate to="/" /> : <UpdateProfile />
          }
        />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<>Hello This is the admin page</>} />
          <Route path="approve-users" element={<ApproveUsersPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
