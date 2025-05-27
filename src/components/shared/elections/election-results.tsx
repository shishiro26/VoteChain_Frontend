import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Crown } from "lucide-react";

type Election = {
  id: string;
  title: string;
  purpose: string;
  startDate: string; // or Date
  endDate: string; // or Date
  level: string;
  electionType: string;
  status: "UPCOMING" | "ONGOING" | "COMPLETED";
  resultDeclared: boolean;
  tags: string[];
  priority: string;
  constituency: {
    id: string;
    name: string;
  };
  hasVoted: boolean;
  totalVoters: number;
  totalVotesCast?: number;
  candidates: {
    id: string;
    party: {
      id: string;
      name: string;
      symbol: string;
      manifesto: string;
    };
    user: {
      id: string;
      firstName: string;
      lastName: string;
      profileImage: string;
      dob: string;
      description: string;
    };
    votes?: number;
  }[];
  winner?: {
    id: string;
    party?: {
      id: string;
      name: string;
      symbol: string;
      manifesto: string;
    };
    user?: {
      id: string;
      firstName: string;
      lastName: string;
      profileImage: string;
      dob: string;
      description: string;
    };
    votes?: number;
  } | null;
};

export function ElectionResults({ election }: { election: Election }) {
  const getVoterTurnout = (totalVotes: number, targetVotes: number) => {
    return Math.round((totalVotes / targetVotes) * 100);
  };

  const voterTurnout = getVoterTurnout(
    election.totalVotesCast || 0,
    election.totalVoters || 0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Election Results</CardTitle>
        <CardDescription>Final vote counts for all candidates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {election.winner && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 flex items-center">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <Crown className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-green-800 flex items-center">
                  Winner: {election.winner.user?.firstName}{" "}
                  {election.winner.user?.lastName}
                  <Badge className="ml-2 bg-green-600">
                    {Math.round(
                      ((election.winner.votes ?? 0) /
                        (election.totalVotesCast || 1)) *
                        100
                    )}
                    % votes
                  </Badge>
                </h3>
                <div className="flex items-center text-green-700">
                  <span className="text-lg mr-1">
                    {election.winner.party?.symbol}
                  </span>
                  <span>{election.winner.party?.name}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-800">
                  {election.winner.votes}
                </div>
                <div className="text-sm text-green-700">votes</div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-medium mb-2">Voter Turnout</h3>
            <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
              <span>
                {election.totalVotesCast || 0} of {election.totalVoters}{" "}
                expected voters
              </span>
              <span>{voterTurnout}% turnout</span>
            </div>
            <Progress value={voterTurnout} className="h-2" />
          </div>

          <div className="border-t pt-6">
            <h3 className="font-medium mb-4">Candidate Results</h3>
            {election.candidates
              .sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0))
              .map((candidate) => {
                const isWinner = election.winner?.id === candidate.id;
                const percentage = Math.round(
                  ((candidate.votes ?? 0) / election.totalVoters) * 100
                );

                return (
                  <div key={candidate.id} className="relative mb-6 last:mb-0">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center flex-1">
                        <div className="relative mr-4">
                          <img
                            src={
                              candidate.user.profileImage || "/placeholder.svg"
                            }
                            alt={`${candidate.user.firstName} ${candidate.user.lastName}`}
                            className="w-12 h-12 rounded-full object-cover border"
                          />
                          {isWinner && (
                            <div className="absolute -top-1 -right-1 bg-green-500 text-white p-0.5 rounded-full">
                              <Crown className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {candidate.user.firstName} {candidate.user.lastName}{" "}
                            {isWinner && (
                              <span className="text-green-600">(Winner)</span>
                            )}
                          </p>
                          {candidate.party && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <span className="text-base mr-1">
                                {candidate.party.symbol}
                              </span>
                              {candidate.party.name}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{candidate.votes} votes</p>
                        <p className="text-xs text-muted-foreground">
                          {percentage}% of total
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          isWinner ? "bg-green-500" : "bg-primary/60"
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
