import type React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Users, Award, MapPin, Calendar, User } from "lucide-react";
import { formatDate } from "@/utils/formatDate";

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
      dob: string; // or Date
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

interface ElectionStatsProps {
  election: Election;
}

export function ElectionStats({ election }: ElectionStatsProps) {
  const getVoterTurnout = (totalVotes: number, targetVotes: number) => {
    return Math.round((totalVotes / targetVotes) * 100);
  };

  const voterTurnout = getVoterTurnout(
    election.totalVoters,
    election.totalVotesCast || 0
  );

  const renderStatCard = (
    icon: React.ComponentType<{ className?: string }>,
    title: string,
    value: string | number,
    description?: string
  ) => {
    const Icon = icon;
    return (
      <Card className="border border-border">
        <CardContent className="p-4">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              <p className="text-xl font-semibold">{value}</p>
              {description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {renderStatCard(
        Users,
        "Total Votes",
        election.totalVoters.toLocaleString(),
        election.status !== "UPCOMING"
          ? `${voterTurnout}% voter turnout`
          : "Expected turnout"
      )}

      {election.status === "COMPLETED" && election.winner
        ? renderStatCard(
            Award,
            "Winner",
            election.winner.user?.firstName ?? "Unknown",
            `${election.winner.party?.name} - ${
              election.winner.votes ?? 0
            } votes`
          )
        : renderStatCard(
            User,
            "Candidates",
            election.candidates.length,
            "From various political parties"
          )}

      {renderStatCard(MapPin, "Constituency", election.constituency.name)}

      {renderStatCard(
        Calendar,
        "Duration",
        `${Math.ceil(
          (new Date(election.endDate).getTime() -
            new Date(election.startDate).getTime()) /
            (1000 * 60 * 60 * 24)
        )} days`,
        `${formatDate(new Date(election.startDate))} - ${formatDate(
          new Date(election.endDate)
        )}`
      )}
    </div>
  );
}
