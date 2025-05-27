import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, MapPin, Users, Info, ExternalLink } from "lucide-react";
import { getElectionStatusPage } from "@/utils/status-badge";
import { formatDate } from "@/utils/formatDate";
import { getDaysRemaining, getTimeProgress } from "@/utils/election";

type ElectionResponse = {
  id: string;
  title: string;
  purpose: string;
  startDate: string;
  endDate: string;
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

interface ElectionHeaderProps {
  election: ElectionResponse;
}

export function ElectionHeader({ election }: ElectionHeaderProps) {
  const getVoterTurnout = (totalVotes: number, targetVotes: number) => {
    return Math.round((totalVotes / targetVotes) * 100);
  };

  const voterTurnout = getVoterTurnout(
    election.totalVotesCast ? election.totalVotesCast : 0,
    election.totalVoters ? election.totalVoters : 0
  );

  return (
    <Card className="mb-8 overflow-hidden border border-border pt-0">
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border">
        <CardHeader className="pb-6 pt-6">
          <div className="flex flex-col lg:flex-row justify-between lg:items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <CardTitle className="text-2xl">{election.title}</CardTitle>
                {getElectionStatusPage(election.status)}
              </div>
              <CardDescription className="mb-4">
                {election.purpose}
              </CardDescription>

              <div className="flex flex-wrap gap-2 mb-4">
                {election.tags.map((tag) => (
                  <Badge variant="secondary" key={tag} className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>
                    {formatDate(new Date(election.startDate))} -{" "}
                    {formatDate(new Date(election.endDate))}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{election.constituency.name}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{election.candidates.length} Candidates</span>
                </div>
                {/* {election.additional_info && (
                  <div className="flex items-center">
                    <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{election.additional_info.commission}</span>
                  </div>
                )} */}
              </div>
            </div>

            <div className="lg:w-80">
              {election.status === "ONGOING" && (
                <div className="bg-white rounded-lg p-4 border border-border">
                  <div className="text-center mb-4">
                    <Badge variant="default" className="text-xs mb-2">
                      {getDaysRemaining(
                        new Date(election.startDate),
                        new Date(election.endDate)
                      )}{" "}
                      days left
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Election Progress</span>
                        <span>
                          {getTimeProgress(
                            new Date(election.startDate),
                            new Date(election.endDate)
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={getTimeProgress(
                          new Date(election.startDate),
                          new Date(election.endDate)
                        )}
                        className="h-2"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Voter Turnout</span>
                        <span>{voterTurnout}%</span>
                      </div>
                      <Progress value={voterTurnout} className="h-2" />
                    </div>
                  </div>
                </div>
              )}

              {/* {election.status === 2 && winner && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-center">
                    <Crown className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-medium text-green-800">Winner</h3>
                    <p className="text-lg font-bold text-green-900">
                      {winner.name}
                    </p>
                    <p className="text-sm text-green-700">
                      {winner.party?.name}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      {winner.votes} votes
                    </p>
                  </div>
                </div>
              )} */}
            </div>
          </div>
        </CardHeader>
      </div>

      <CardContent>
        <p className="text-muted-foreground">{election.purpose}</p>

        <div className="mt-4 bg-muted/30 rounded-md p-3 text-sm">
          <div className="font-medium mb-2">Official Resources:</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <a
              href="https://eci.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center"
            >
              <ExternalLink className="h-3.5 w-3.5 mr-2" />
              Official Website
            </a>
            <a
              href={`mailto:contact@eci.gov.in`}
              className="text-primary hover:underline flex items-center"
            >
              <Info className="h-3.5 w-3.5 mr-2" />
              Contact: contact@eci.gov.in
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
