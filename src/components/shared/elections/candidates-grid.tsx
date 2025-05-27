import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileText, CheckCircle } from "lucide-react";

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

export function CandidatesGrid({
  candidates,
}: {
  candidates: ElectionResponse["candidates"];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {candidates.map((candidate) => (
        <Card
          key={candidate.id}
          className="hover:shadow-md transition-shadow overflow-hidden"
        >
          <CardContent className="p-0">
            <div className="p-6 bg-muted/20 flex justify-center border-b">
              <img
                src={candidate.user.profileImage || "/placeholder.svg"}
                alt={candidate.user.firstName}
                className="w-24 h-24 rounded-full object-cover border-2 border-border"
              />
            </div>

            <div className="p-6">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold">
                  {candidate.user.firstName} {candidate.user.lastName}
                </h3>
                {candidate.user.dob && (
                  <div className="text-sm text-muted-foreground">
                    Age:{" "}
                    {new Date().getFullYear() -
                      new Date(candidate.user.dob).getFullYear()}
                  </div>
                )}
              </div>

              {candidate.party && (
                <div className="flex justify-center items-center mb-4">
                  <Badge
                    variant="outline"
                    className="flex items-center px-3 py-1.5"
                  >
                    <span className="mr-2 text-lg">
                      {candidate.party.symbol}
                    </span>
                    {candidate.party.name}
                    <CheckCircle className="h-4 w-4 ml-2 text-blue-500" />
                  </Badge>
                </div>
              )}

              {candidate.user.description && (
                <p className="text-sm text-muted-foreground text-center mb-4 line-clamp-3">
                  {candidate.user.description.slice(0, 100)}...
                </p>
              )}

              <div className="flex justify-center gap-2">
                {candidate.party.manifesto && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4 mr-1" /> Manifesto
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="w-80 p-4">
                        <p className="text-sm">{candidate.party.manifesto}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
