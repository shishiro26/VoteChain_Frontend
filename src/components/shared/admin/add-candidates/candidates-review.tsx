import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatDate";
import { AlertTriangle, Lock } from "lucide-react";
import { useAddCandidateMutation } from "@/api";
import { Loader } from "@/components/ui/loader";
import { toast } from "sonner";
import { useLocation } from "react-router";

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
const CandidatesReview = ({
  selectedCandidates,
  setSelectedCandidates,
  setElection,
  setActiveTab,
  setTabMode,
  onBack,
  election,
}: {
  selectedCandidates: User[];
  setSelectedCandidates: React.Dispatch<React.SetStateAction<User[]>>;
  setElection: React.Dispatch<React.SetStateAction<string | null>>;
  setActiveTab: (tab: string) => void;
  setTabMode: (mode: "initial" | "add" | "back") => void;
  onBack: () => void;
  election: Election;
}) => {
  const [showFinalConfirmation, setShowFinalConfirmation] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const electionId = queryParams.get("electionId");

  const addCandidates = useAddCandidateMutation();
  const handleSubmitCandidates = () => {
    const payload = {
      electionId: election.id,
      constituencyId: election.location.constituencyId,
      candidates: selectedCandidates.map((candidate) => {
        return {
          userId: candidate.id,
          partyId: candidate.party?.id,
        };
      }),
    };
    addCandidates.mutate(payload, {
      onSuccess: () => {
        toast.success("Candidates successfully registered for the election", {
          description: "You can now proceed to the voting phase.",
        });
        setTimeout(() => {
          setShowFinalConfirmation(false);
          setSelectedCandidates([]);
          setElection(null);
          setActiveTab("elections");
          setTabMode("initial");
          if (electionId) {
            const newUrl =
              location.pathname +
              location.search.replace(`?electionId=${electionId}`, "");
            window.history.replaceState({}, "", newUrl);
          }
        }, 3000);
      },
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Review & Confirm Candidates</CardTitle>
          <CardDescription>
            Review the selected party members as candidates before confirming
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-muted/20 p-4 rounded-md">
              <h3 className="font-medium">Election Details</h3>
              {election && (
                <div className="mt-2 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">Title:</span> {election.title}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Type:</span>{" "}
                    <Badge variant="outline" className="capitalize">
                      {election.electionType.toLowerCase().replace("_", " ")}
                    </Badge>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Location:</span>{" "}
                    {election.location.constituencyName},{" "}
                    {election.location.districtName},{" "}
                    {election.location.stateName}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Date:</span>{" "}
                    {formatDate(new Date(election.startDate))} -{" "}
                    {formatDate(new Date(election.endDate))}
                  </p>
                </div>
              )}
            </div>

            <div>
              <h3 className="font-medium mb-3">
                Selected Party Member Candidates ({selectedCandidates.length})
              </h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Party</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedCandidates.map((candidate) => (
                      <TableRow key={candidate.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage
                                src={
                                  candidate.profileImage || "/placeholder.svg"
                                }
                                alt={candidate.firstName}
                              />
                              <AvatarFallback>
                                {candidate.firstName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {candidate.firstName} {candidate.lastName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {candidate.email}
                              </p>
                              <p className="text-xs text-muted-foreground font-mono">
                                {candidate.walletAddress.substring(0, 10)}...
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {candidate.party ? (
                            <div className="flex items-center gap-2">
                              <span className="text-lg">
                                {candidate.party.symbol}
                              </span>
                              <span className="text-sm">
                                {candidate.party.name}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">
                              Independent
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm">
                              {candidate.location?.stateName || "N/A"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {candidate.location?.constituencyName || "N/A"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              candidate.role === "PHEAD"
                                ? "default"
                                : "secondary"
                            }
                            className="capitalize"
                          >
                            {candidate.role?.replace("_", " ") || "Member"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="bg-muted/20 p-4 rounded-md">
              <h3 className="font-medium mb-2">Confirmation</h3>
              <p className="text-sm text-muted-foreground">
                By submitting, you confirm that all the selected party members
                are eligible to participate as candidates in this election. This
                action will register them as official candidates and cannot be
                undone.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <Button variant="outline" onClick={onBack}>
            Back to Candidates
          </Button>
          <Button
            onClick={() => setShowFinalConfirmation(true)}
            disabled={
              addCandidates.isPending || selectedCandidates.length === 0
            }
          >
            Confirm and Register Candidates
          </Button>
        </CardFooter>
      </Card>
      <AlertDialog
        open={showFinalConfirmation}
        onOpenChange={setShowFinalConfirmation}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Final Election Confirmation
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 select-none cursor-not-allowed">
              <p>
                You are about to finalize this election with{" "}
                <strong>{selectedCandidates.length} candidates</strong>.
              </p>
              <div className="bg-red-50 border border-red-200 p-3 rounded-md">
                <p className="text-sm text-red-800 font-medium">
                  This action is irreversible!
                </p>
                <ul className="text-sm text-red-700 mt-2 space-y-1">
                  <li>• No new candidates can be added</li>
                  <li>• Existing candidates cannot be removed</li>
                  <li>• Candidate details cannot be modified</li>
                  <li>• The election will be locked and ready for voting</li>
                </ul>
              </div>
              <p className="text-sm">
                Please confirm that all candidate information is accurate and
                complete before proceeding.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleSubmitCandidates}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              disabled={addCandidates.isPending}
            >
              {addCandidates.isPending && (
                <Loader
                  size="sm"
                  className="mr-2 border-white border-t-transparent"
                />
              )}
              <Lock className="h-4 w-4" />
              Yes, Finalize Election
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CandidatesReview;
