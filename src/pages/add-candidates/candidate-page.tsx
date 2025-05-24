import { useState, useEffect } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import ElectionsTab from "@/components/shared/admin/add-candidates/elections-tab";
import CandidatesTab from "@/components/shared/admin/add-candidates/candidates-tab";
import CandidatesReview from "@/components/shared/admin/add-candidates/candidates-review";
import { useLocation, useNavigate } from "react-router";
import { useGetElectionsQuery } from "@/api";
import { Loader } from "@/components/ui/loader";
import { Plus } from "lucide-react";

type ElectionLocation = {
  constituencyId: string;
  constituencyName: string;
  mandalName: string;
  districtName: string;
  stateName: string;
};

type Election = {
  id: string;
  title: string;
  purpose: string;
  startDate: string;
  endDate: string;
  status: "UPCOMING" | "ONGOING" | "COMPLETED";
  electionType:
    | "LOK_SABHA"
    | "VIDHAN_SABHA"
    | "MUNICIPAL"
    | "PANCHAYAT"
    | "BY_ELECTION"
    | string;
  level: "STATE" | "DISTRICT" | "MANDAL" | "CONSTITUENCY" | string;
  location: ElectionLocation;
};

export default function AddCandidatesPage() {
  const [selectedElection, setSelectedElection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("elections");
  const [tabMode, setTabMode] = useState<"initial" | "add" | "back">("initial");
  const [selectedCandidates, setSelectedCandidates] = useState<User[]>([]);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const electionId = queryParams.get("electionId");

  useEffect(() => {
    if (electionId) {
      setSelectedElection(electionId);
      setActiveTab(`candidates/${electionId}`);
      setTabMode("add");
    }
  }, [electionId]);

  const { data, isLoading } = useGetElectionsQuery({
    page: 1,
    limit: 10,
    sortBy: "createdAt:desc",
  });

  const handleElectionSelect = (id: string) => {
    setSelectedElection(id);
    setActiveTab(`candidates/${id}`);
    setTabMode("add");
    navigate(`?electionId=${id}`);
  };

  const handleBack = () => {
    setActiveTab("elections");
    setTabMode("back");
  };

  const handleReviewBack = () => {
    setActiveTab(`candidates/${selectedElection}`);
    setTabMode("back");
  };

  const ElectionSelected =
    data && data.find((election: Election) => election.id === selectedElection);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Election Candidate Management</h1>
          <p className="text-muted-foreground mt-1">
            Add party members as candidates to participate in elections
          </p>
        </div>
        <Button
          className="mt-4 md:mt-0"
          onClick={() => navigate("/admin/create-election")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Election
        </Button>
      </div>

      <Tabs
        defaultValue="elections"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-4">
          <TabsTrigger
            value="elections"
            disabled={
              activeTab === "review" ||
              isLoading ||
              (tabMode === "add" && activeTab !== "elections")
            }
          >
            Select Election
          </TabsTrigger>
          <TabsTrigger
            value={selectedElection ? `candidates/${selectedElection}` : ""}
            disabled={
              activeTab === "review" ||
              isLoading ||
              !selectedElection ||
              (tabMode === "initial" &&
                activeTab !== `candidates/${selectedElection}`)
            }
          >
            Add Party Members as Candidates
          </TabsTrigger>
          <TabsTrigger
            value="review"
            disabled={
              isLoading || (tabMode === "initial" && activeTab !== "review")
            }
          >
            Review & Confirm
          </TabsTrigger>
        </TabsList>

        <TabsContent value="elections" className="mt-0">
          {isLoading ? (
            <Loader size="lg" text="Loading elections..." />
          ) : (
            <ElectionsTab
              elections={data}
              selectedElection={selectedElection}
              onElectionSelect={handleElectionSelect}
            />
          )}
        </TabsContent>

        <TabsContent value={`candidates/${selectedElection}`} className="mt-0">
          {isLoading ? (
            <Loader size="lg" text="Loading candidates..." />
          ) : (
            <CandidatesTab
              selectedCandidates={selectedCandidates}
              setSelectedCandidates={setSelectedCandidates}
              election={ElectionSelected}
              onBack={handleBack}
              setActiveTab={setActiveTab}
            />
          )}
        </TabsContent>

        <TabsContent value="review" className="mt-0">
          {isLoading ? (
            <Loader size="lg" text="Loading review..." />
          ) : (
            selectedCandidates.length !== 0 && (
              <CandidatesReview
                selectedCandidates={selectedCandidates}
                setSelectedCandidates={setSelectedCandidates}
                setElection={setSelectedElection}
                setActiveTab={setActiveTab}
                setTabMode={setTabMode}
                onBack={handleReviewBack}
                election={ElectionSelected}
              />
            )
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
