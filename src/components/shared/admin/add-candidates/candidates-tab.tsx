import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, UserPlus, Users } from "lucide-react";
import { WalletSearch } from "../search/wallet-search";
import { toast } from "sonner";

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

const CandidatesTab = ({
  selectedCandidates,
  setSelectedCandidates,
  election,
  onBack,
  setActiveTab,
}: {
  selectedCandidates: User[];
  setSelectedCandidates: React.Dispatch<React.SetStateAction<User[]>>;
  election: Election;
  onBack: () => void;
  setActiveTab: (tab: string) => void;
}) => {
  const handleAddCandidate = (user: User) => {
    setSelectedCandidates((prev) => {
      const isCandidateAlreadySelected = prev.some(
        (candidate) => candidate.id === user.id
      );
      if (isCandidateAlreadySelected) {
        toast.info("User is already selected as a candidate", {
          description: `${user.firstName} ${user.lastName} is already in the candidate list.`,
        });
        return prev;
      }
      return [...prev, user];
    });
  };

  const handleRemoveCandidate = (id: string) => {
    setSelectedCandidates((prev) =>
      prev.filter((candidate) => candidate.id !== id)
    );
  };

  const excludePartyIds = selectedCandidates
    .map((candidate) => candidate.party?.id)
    .filter((id): id is string => id !== undefined);

  const handleSubmit = () => {
    if (selectedCandidates.length < 2) {
      toast.error("Please select at least 2 candidates");
      return;
    }
    localStorage.setItem(
      "selectedCandidates",
      JSON.stringify(selectedCandidates)
    );

    setActiveTab("review");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Party Members as Candidates</CardTitle>
        <CardDescription>
          Search for party members by wallet address to add them as candidates
          for {election.title}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-lg font-medium">Search Party Members</h3>
              <p className="text-sm text-muted-foreground">
                Find party members by their wallet address to add them as
                candidates
              </p>
            </div>

            <WalletSearch
              onUserSelect={handleAddCandidate}
              buttonText="Search Party Members"
              buttonIcon={<UserPlus className="mr-2 h-4 w-4" />}
              buttonVariant="default"
              excludePartyIds={excludePartyIds}
            />
          </div>

          {selectedCandidates.length > 0 ? (
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">
                Selected Candidates ({selectedCandidates.length})
              </h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Party</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Description Status</TableHead>
                      <TableHead>Actions</TableHead>
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
                                {candidate.walletAddress.slice(0, 10)}...
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
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive"
                            onClick={() => handleRemoveCandidate(candidate.id)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No Candidates Selected
              </h3>
              <p className="text-muted-foreground mb-4">
                Search for party members by wallet address to add them as
                candidates for this election.
              </p>
              <WalletSearch
                onUserSelect={handleAddCandidate}
                buttonText="Search Your First Candidate"
                buttonIcon={<UserPlus className="mr-2 h-4 w-4" />}
                buttonVariant="outline"
                excludePartyIds={excludePartyIds}
              />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline" onClick={onBack}>
          Back to Elections
        </Button>
        <Button onClick={handleSubmit} disabled={selectedCandidates.length < 2}>
          Review Candidates
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CandidatesTab;
