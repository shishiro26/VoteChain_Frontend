import { Route, Routes } from "react-router";
import Home from "./page.tsx";
import Layout from "@/layout/Layout.tsx";
import AdminLayout from "./layout/AdminLayout.tsx";
import UpdateProfile from "./pages/update-profile.tsx";
import ApproveUsersPage from "./pages/approve-users.tsx";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<>Hello This is the admin page</>} />
          <Route path="approve-users" element={<ApproveUsersPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
