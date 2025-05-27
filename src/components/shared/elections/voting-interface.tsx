import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Shield, Clock, X } from "lucide-react";
import { Loader } from "@/components/ui/loader";

type Election = {
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

interface VotingInterfaceProps {
  election: Election;
  isLoading: boolean;
  onVote: (candidateId: string) => void;
  onExit: () => void;
}

export function VotingInterface({
  election,
  isLoading,
  onVote,
  onExit,
}: VotingInterfaceProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<string>("");

  const getDaysRemaining = (startDate: Date, endDate: Date): string => {
    const now = new Date();

    if (now < startDate) {
      const diffDays = Math.ceil(
        (startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      return `Starts in ${diffDays} day${diffDays !== 1 ? "s" : ""}`;
    } else if (now <= endDate) {
      const diffDays = Math.ceil(
        (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} remaining`;
    } else {
      return "Completed";
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-auto">
      <div className="min-h-screen flex flex-col">
        <div className="bg-primary/5 border-b border-border p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onExit}>
                <X className="h-4 w-4 mr-2" />
                Exit Voting
              </Button>
              <div>
                <h1 className="text-xl font-bold">{election.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {election.constituency.name}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </div>
              <Badge variant="outline" className="px-3 py-1">
                <Clock className="h-3 w-3 mr-1" />
                {getDaysRemaining(
                  new Date(election.startDate),
                  new Date(election.endDate)
                )}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex-1 container mx-auto px-4 py-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-4">
              <h2 className="text-3xl font-bold mb-2">Cast Your Vote</h2>
              <p className="text-muted-foreground">
                Select your preferred candidate below
              </p>
            </div>

            <Alert className="mx-auto mb-4 flex items-center justify-center bg-blue-50 border-blue-200 w-fit">
              <Shield className="h-4 w-4 text-blue-600" />
              <div>
                <AlertTitle className="text-blue-800">Secure Voting</AlertTitle>
                <AlertDescription className="text-blue-700">
                  Your vote will be securely recorded on the blockchain. Once
                  submitted, it cannot be changed.
                </AlertDescription>
              </div>
            </Alert>

            <RadioGroup
              value={selectedCandidate}
              onValueChange={setSelectedCandidate}
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {election.candidates.map((candidate) => (
                  <Card
                    key={candidate.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedCandidate === candidate.id
                        ? "ring-2 ring-primary shadow-lg scale-105"
                        : "hover:scale-102"
                    }`}
                    onClick={() => setSelectedCandidate(candidate.id)}
                  >
                    <CardContent className="p-6">
                      <div className="text-center space-y-4">
                        <div className="relative mx-auto w-24 h-24">
                          <img
                            src={
                              candidate.user.profileImage || "/placeholder.svg"
                            }
                            alt={candidate.user.firstName}
                            className="w-full h-full rounded-full object-cover border-2 border-border"
                          />
                          {selectedCandidate === candidate.id && (
                            <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground p-1 rounded-full">
                              <CheckCircle className="h-4 w-4" />
                            </div>
                          )}
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold">
                            {candidate.user.firstName} {candidate.user.lastName}
                          </h3>
                          {candidate.user.dob && (
                            <p className="text-sm text-muted-foreground">
                              Age:{" "}
                              {new Date().getFullYear() -
                                new Date(candidate.user.dob).getFullYear()}
                            </p>
                          )}
                        </div>

                        {candidate.party && (
                          <div className="flex justify-center">
                            <Badge variant="outline" className="px-3 py-1">
                              <span className="text-lg mr-2">
                                {candidate.party.symbol}
                              </span>
                              {candidate.party.name}
                              <CheckCircle className="h-3 w-3 ml-2 text-blue-500" />
                            </Badge>
                          </div>
                        )}

                        {candidate.user.description && (
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {candidate.user.description}
                          </p>
                        )}

                        <div className="flex items-center justify-center pt-2">
                          <RadioGroupItem
                            value={candidate.id}
                            id={candidate.id}
                            className="mr-2"
                          />
                          <Label
                            htmlFor={candidate.id}
                            className="cursor-pointer font-medium"
                          >
                            Select {candidate.user.firstName}{" "}
                            {candidate.user.lastName}
                          </Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </RadioGroup>

            <div className="text-center">
              <Button
                size="lg"
                onClick={onVote.bind(null, selectedCandidate)}
                disabled={!selectedCandidate || isLoading}
                className="px-12 py-3 text-lg"
              >
                {isLoading && (
                  <Loader
                    size="sm"
                    className="mr-2 border-white border-t-transparent"
                  />
                )}
                Cast vote
              </Button>
              {selectedCandidate && (
                <p className="text-sm text-muted-foreground mt-2">
                  You have selected:{" "}
                  <span className="font-medium">
                    {
                      election.candidates.find(
                        (c) => c.id === selectedCandidate
                      )?.user.firstName
                    }{" "}
                    {
                      election.candidates.find(
                        (c) => c.id === selectedCandidate
                      )?.user.lastName
                    }
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
