import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Calendar,
  CheckCircle,
  Crown,
  MapPin,
  Medal,
  Search,
} from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { useDeclareResultMutation, useGetElectionResultsQuery } from "@/api";
import { useSearchParams } from "react-router";
import Pagination from "@/components/shared/pagination";
import { Loader } from "@/components/ui/loader";
import { toast } from "sonner";

type Party = {
  id: string;
  name: string;
  symbol: string;
};

type Candidate = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  party: Party;
  votes: number;
  winner: boolean;
};

type Constituency = {
  id: string;
  name: string;
};

type Election = {
  id: string;
  title: string;
  purpose: string;
  startDate: string;
  endDate: string;
  level: "CONSTITUENCY" | "STATE" | "NATIONAL";
  electionType: "LOK_SABHA" | "VIDHAN_SABHA" | "BY_ELECTION";
  status: "ONGOING" | "COMPLETED" | "UPCOMING";
  resultDeclared: boolean;
  isDraw: boolean;
  totalVotes: number;
  constituency: Constituency;
  candidates: Candidate[];
};

export default function DeclareResultsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedElection, setSelectedElection] = useState<Election | null>(
    null
  );
  const [declareDialogOpen, setDeclareDialogOpen] = useState(false);
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const { data, isLoading } = useGetElectionResultsQuery({
    page: 1,
    limit: 3,
    sortBy: "createdAt:desc",
  });

  const declareResult = useDeclareResultMutation();

  const totalPages = data?.query?.totalPages || 1;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      searchParams.set("page", page.toString());
      setSearchParams(searchParams);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const filteredElections =
    data &&
    data.data.filter(
      (election: Election) =>
        election.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        election.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
        election.constituency.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );

  const handleDeclareResult = (election: Election) => {
    setSelectedElection(election);
    setDeclareDialogOpen(true);
  };

  const confirmDeclareResult = () => {
    if (!selectedElection) return;
    declareResult.mutate(
      {
        electionId: selectedElection.id,
      },
      {
        onSuccess: () => {
          toast.success(
            `Results for ${selectedElection.title} declared successfully!`,
            {
              duration: 3000,
            }
          );
          setDeclareDialogOpen(false);
          setSelectedElection(null);
        },
      }
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Declare Results</h1>

      <div className="mb-2">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search completed elections..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      {isLoading ? (
        <Loader size="lg" text="Loading completed elections..." />
      ) : filteredElections.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No completed elections found.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {filteredElections.map((election: Election) => {
            const winner = election.candidates.find((c) => c.winner);

            return (
              <Card key={election.id} className="overflow-hidden pt-0">
                <CardHeader className="bg-primary/5 border-b border-border pt-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">
                        {election.title}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {election.purpose.slice(0, 100)}...
                      </CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            {formatDate(new Date(election.startDate))} -{" "}
                            {formatDate(new Date(election.endDate))}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{election.constituency.name}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">
                            {election.totalVotes}
                          </span>{" "}
                          total votes cast
                        </div>
                      </div>

                      <div>
                        {election.resultDeclared ? (
                          <div className="flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-md">
                            <Crown className="h-5 w-5 mr-2" />
                            <div>
                              <p className="font-medium">Results Declared</p>
                              {election.isDraw ? (
                                <p className="text-sm text-yellow-800">
                                  Result: <strong>Draw</strong>
                                </p>
                              ) : winner ? (
                                <p className="text-sm">
                                  Winner: {winner.firstName} {winner.lastName} (
                                  {winner.party.name})
                                </p>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  No winner info available
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <Button onClick={() => handleDeclareResult(election)}>
                            <Medal className="h-4 w-4" /> Declare Result
                          </Button>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        Candidates & Vote Count
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {election.candidates.map((candidate) => {
                          const isWinner = candidate.winner;
                          return (
                            <Card
                              key={candidate.id}
                              className={`hover:shadow-md transition-shadow ${
                                isWinner ? "border-green-500 bg-green-50" : ""
                              }`}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center space-x-4">
                                  <div className="relative">
                                    <img
                                      src={
                                        candidate.profileImage ||
                                        "/placeholder.svg"
                                      }
                                      alt={candidate.firstName}
                                      className="w-16 h-16 rounded-full object-cover border"
                                    />
                                    {isWinner && (
                                      <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full">
                                        <Crown className="h-4 w-4" />
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-medium">
                                      {candidate.firstName} {candidate.lastName}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      {candidate.party.name}
                                    </p>
                                    <div className="mt-1 flex items-center">
                                      <Badge
                                        variant="outline"
                                        className={`${
                                          isWinner
                                            ? "bg-green-100 text-green-800 border-green-200"
                                            : "bg-muted text-muted-foreground"
                                        }`}
                                      >
                                        {candidate.votes} votes
                                      </Badge>
                                      {isWinner && (
                                        <span className="ml-2 text-xs text-green-600 font-medium">
                                          Winner
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>

                {!election.resultDeclared && (
                  <CardFooter className="border-t border-border pt-4 bg-muted/30">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Note:</span> Declaring
                      results is final and cannot be undone. The results will be
                      published on the blockchain for transparency.
                    </p>
                  </CardFooter>
                )}
              </Card>
            );
          })}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              goToPage={goToPage}
              goToNextPage={goToNextPage}
              goToPreviousPage={goToPreviousPage}
            />
          )}
        </div>
      )}

      <AlertDialog open={declareDialogOpen} onOpenChange={setDeclareDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Declare Election Results</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to declare the results for{" "}
              {selectedElection?.title}? This action is final and will be
              recorded on the blockchain.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              onClick={confirmDeclareResult}
              className="bg-primary hover:bg-primary/90"
              disabled={declareResult.isPending}
            >
              {declareResult.isPending ? (
                <Loader
                  size="sm"
                  className="border-white border-t-transparent"
                />
              ) : (
                <Medal className="h-4 w-4F" />
              )}
              Declare Results
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
