import { Navigate, Route, Routes } from "react-router";
import Home from "./page.tsx";
import Layout from "@/layout/Layout.tsx";
import AdminLayout from "@/layout/AdminLayout.tsx";

import { useWallet } from "@/store/useWallet.ts";
import UpdateProfile from "@/pages/update-profile/update-profile.tsx";

import NotFound from "@/components/shared/not-found.tsx";
import ProfilePage from "@/pages/profile/page.tsx";
import VotePage from "@/pages/vote/elections.tsx";
import ElectionDetailPage from "@/pages/vote/election-detail-page.tsx";

import SecurePartyCreationPage from "@/pages/parties/page.tsx";
import VerifyEmailToken from "@/pages/parties/verify-email-token.tsx";
import PartiesPage from "@/pages/parties/browse-party.tsx";
import PartyDetailsPage from "@/pages/parties/party-details-page.tsx";
import ManagePartyMembersPage from "./pages/parties/manage-members.tsx";

import ApproveUsersPage from "@/pages/approve-users.tsx";
import DeclareResultsPage from "@/pages/declare-results.tsx";
import AddCandidatesPage from "@/pages/add-candidates/candidate-page.tsx";
import ManagePartiesPage from "@/pages/manage-parties/manage-parties.tsx";

import CreateElectionPage from "@/pages/create-elections/create-elections.tsx";
import CreateStateElectionPage from "@/pages/create-elections/state/state.tsx";
import CreateConstituencyElectionPage from "@/pages/create-elections/constituency.tsx";
import LoginPage from "./pages/login/login.tsx";
import AdminDashboard from "./pages/admin/page.tsx";

function App() {
  const { isProfileComplete } = useWallet();

  return (
    <Routes>
      <Route path="/auth/login" element={<LoginPage />} />

      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />

        <Route
          element={isProfileComplete ? <Navigate to="/" /> : <UpdateProfile />}
          path="/update-profile"
        />
        <Route path="/profile/:id" element={<ProfilePage />} />

        <Route path="/vote" element={<VotePage />} />
        <Route path="/vote/:id" element={<ElectionDetailPage />} />

        <Route path="/party/verify" element={<VerifyEmailToken />} />
        <Route path="/party/update" element={<SecurePartyCreationPage />} />
        <Route path="/browse/parties" element={<PartiesPage />} />
        <Route path="/parties/:id" element={<PartyDetailsPage />} />
        <Route path="/parties/:id/edit" element={<ManagePartyMembersPage />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="approve-users" element={<ApproveUsersPage />} />
          <Route path="declare-results" element={<DeclareResultsPage />} />
          <Route path="add-candidates" element={<AddCandidatesPage />} />
          <Route path="manage-parties" element={<ManagePartiesPage />} />

          <Route path="create-election">
            <Route index element={<CreateElectionPage />} />
            <Route path="state" element={<CreateStateElectionPage />} />
            <Route
              path="constituency"
              element={<CreateConstituencyElectionPage />}
            />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
