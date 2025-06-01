import { useState, useEffect, useRef } from "react";
import { ChevronLeft } from "lucide-react";
import { Loader } from "@/components/ui/loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useNavigate } from "react-router";
import { ElectionHeader } from "@/components/shared/elections/election-header";
import { ElectionStats } from "@/components/shared/elections/election-stats";
import { CandidatesGrid } from "@/components/shared/elections/candidates-grid";
import { ElectionResults } from "@/components/shared/elections/election-results";
import { Button } from "@/components/ui/button";
import { VotingInterface } from "@/components/shared/elections/voting-interface";
import { VotingSection } from "@/components/shared/elections/voting-section";
import { useCastVoteMutation, useGetElectionByElectionIdQuery } from "@/api";
import { toast } from "sonner";
import NotFound from "@/components/shared/not-found";
import { useWallet } from "@/store/useWallet";
import { getElectionContract } from "@/utils/getContracts";
import { api } from "@/api/axios";

export default function ElectionDetailPage() {
  // const ATTEMPT_STORAGE_KEY = "aadhaar_verification_attempts";
  // const MAX_ATTEMPTS = 3;
  const votingContainerRef = useRef<HTMLDivElement>(null);
  const { profile } = useWallet();

  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname.split("/").pop() || "";
  const [isVoting, setIsVoting] = useState(false);
  // const [isOpen, setIsOpen] = useState(false);
  // const [aadharVerified, setAadharVerified] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const {
    data: election,
    isLoading,
    isError,
  } = useGetElectionByElectionIdQuery(pathname);

  const castVote = useCastVoteMutation();

  useEffect(() => {
    const onFullscreenChange = () => {
      if (isFullscreen && !document.fullscreenElement) {
        if (votingContainerRef.current) {
          votingContainerRef.current.requestFullscreen().catch((err) => {
            console.error("Re-entering fullscreen failed:", err);
            setIsFullscreen(false);
          });
        }
      }
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, [isFullscreen]);

  const enterFullScreen = () => {
    if (votingContainerRef.current) {
      votingContainerRef.current
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) => console.error("Failed to enter fullscreen mode:", err));
    }
  };

  const exitFullScreen = () => {
    if (document.fullscreenElement) {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch((err) => console.error("Failed to exit fullscreen mode:", err));
    } else {
      setIsFullscreen(false);
    }
  };

  const handleVote = async (selectedCandidateId: string) => {
    try {
      setIsVoting(true);
      const electionContract = await getElectionContract();
      const tx = await electionContract.vote(
        parseInt(election.id.slice(-8), 16),
        election.candidates.find(
          (c: { id: string; user: { walletAddress: string } }) =>
            c.id === selectedCandidateId
        ).user.walletAddress
      );

      const receipt = await tx.wait();
      const payload = {
        transactionHash: receipt.hash,
        from: receipt.from,
        to: receipt.to,
        blockNumber: receipt.blockNumber,
        status: receipt.status === 1 ? "SUCCESS" : "FAILED",
        amount: receipt.gasUsed.toString(),
        type: "VOTE",
      };

      castVote.mutate(
        {
          electionId: election.id,
          candidateId: selectedCandidateId,
        },
        {
          onSuccess: async () => {
            await api.post("/api/v1/auth/create-transaction", payload);
            if (isFullscreen) {
              exitFullScreen();
              election.hasVoted = true;
            }
            const timer = setTimeout(() => {
              toast.success("Vote cast successfully!");
            }, 1000);

            return () => clearTimeout(timer);
          },
        }
      );
    } catch (error) {
      console.error("Error casting vote:", error);
      toast.error("Failed to cast vote. Please try again.");
    } finally {
      setIsVoting(false);
    }
  };

  if (isError) {
    return <NotFound text="Election not found" link="/vote" />;
  }

  return (
    <div
      ref={votingContainerRef}
      className={
        isFullscreen ? "h-screen w-screen" : "container mx-auto px-4 py-4"
      }
    >
      {!isFullscreen && (
        <div className="mb-2">
          <Button variant="outline" onClick={() => navigate("/vote")}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Elections
          </Button>
        </div>
      )}

      {isLoading ? (
        <Loader size="lg" text="Loading election details..." />
      ) : isFullscreen ? (
        <VotingInterface
          election={election}
          isLoading={castVote.isPending}
          isVoting={isVoting}
          onVote={handleVote}
          onExit={exitFullScreen}
        />
      ) : (
        <>
          <ElectionHeader election={election} />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList
              className={`grid w-full ${
                election.status === "COMPLETED" ? "grid-cols-4" : "grid-cols-3"
              }`}
            >
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="candidates">Candidates</TabsTrigger>
              {election.status === "COMPLETED" && (
                <TabsTrigger value="results">Results</TabsTrigger>
              )}
              <TabsTrigger value="verification">Verification</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <ElectionStats election={election} />
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-lg font-semibold mb-4">
                  About This Election
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Purpose</h3>
                    <p className="text-muted-foreground">{election.purpose}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Eligibility</h3>
                    <p className="text-muted-foreground">
                      All registered voters in the {election.constituency_name}{" "}
                      constituency are eligible.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="candidates" className="mt-6">
              <CandidatesGrid candidates={election.candidates} />
            </TabsContent>

            {election.status === "COMPLETED" && (
              <TabsContent value="results" className="mt-6">
                <ElectionResults election={election} />
              </TabsContent>
            )}

            <TabsContent value="verification" className="mt-6">
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Blockchain Verification
                </h2>
                <p className="text-muted-foreground">
                  All votes are recorded on the blockchain for transparency.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {election.status === "ONGOING" &&
            election.constituency.id === profile?.location.constituencyId &&
            profile?.status === "APPROVED" && (
              <div className="mt-8">
                <VotingSection
                  election={election}
                  hasVoted={election.hasVoted}
                  aadhaarVerified={true}
                  onEnterVoting={enterFullScreen}
                  onReturnToElections={() => navigate("/vote")}
                  onVerifyBlockchain={() => setActiveTab("verification")}
                />
              </div>
            )}
        </>
      )}
    </div>
  );
}
