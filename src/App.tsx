import { Navigate, Route, Routes } from "react-router";
import Home from "./page.tsx";
import Layout from "@/layout/Layout.tsx";
import AdminLayout from "@/layout/AdminLayout.tsx";
import UpdateProfile from "@/pages/update-profile.tsx";
import ApproveUsersPage from "@/pages/approve-users.tsx";
import ProfilePage from "@/pages/profile/page.tsx";
import NotFound from "@/components/shared/not-found.tsx";
import DeclareResultsPage from "@/pages/declare-results.tsx";
import AddCandidatesPage from "@/pages/create-elections/add-candidate.tsx";
import CreateElectionPage from "@/pages/create-elections/create-elections.tsx";
import CreateStateElectionPage from "@/pages/create-elections/state/state.tsx";
import CreateConstituencyElectionPage from "@/pages/create-elections/constituency.tsx";
import ElectionDetailPage from "@/pages/vote/[electionid].tsx";
import ResultsPage from "@/pages/results.tsx";
import VotePage from "@/pages/vote/page.tsx";
import { useWallet } from "@/store/useWallet.ts";
import Login from "@/pages/login.tsx";
import ManagePartiesPage from "@/pages/manage-parties/manage-parties.tsx";
import SecurePartyCreationPage from "@/pages/parties/page.tsx";
import VerifyEmailToken from "@/pages/parties/verify-email-token.tsx";
import PartiesPage from "@/pages/parties/browse-party.tsx";
import PartyDetailsPage from "@/pages/parties/party-details-page.tsx";

function App() {
  const { is_profile_complete } = useWallet();
  return (
    <Routes>
      <Route path="/auth" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/party/verify" element={<VerifyEmailToken />} />
        <Route
          path="/update-profile"
          element={
            is_profile_complete ? <Navigate to="/" /> : <UpdateProfile />
          }
        />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/vote/:id" element={<ElectionDetailPage />} />
        <Route path="/vote" element={<VotePage />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/party/update/" element={<SecurePartyCreationPage />} />
        <Route path="/parties/:id" element={<PartyDetailsPage />} />
        <Route path="/browse/parties" element={<PartiesPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<>Hello This is the admin page</>} />
          <Route path="approve-users" element={<ApproveUsersPage />} />
          <Route path="declare-results" element={<DeclareResultsPage />} />
          <Route path="add-candidates" element={<AddCandidatesPage />} />
          <Route path="manage-parties" element={<ManagePartiesPage />} />
          <Route path="create-election">
            <Route index element={<CreateElectionPage />} />
            <Route
              path="constituency"
              element={<CreateConstituencyElectionPage />}
            />
            <Route path="state" element={<CreateStateElectionPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
