import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CheckCircle,
  Shield,
  Eye,
  Users,
  Maximize,
  Clock,
  AlertCircle,
} from "lucide-react";

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

interface VotingSectionProps {
  election: Election;
  hasVoted: boolean;
  aadhaarVerified: boolean;
  onEnterVoting: () => void;
  onReturnToElections: () => void;
  onVerifyBlockchain: () => void;
}

export function VotingSection({
  election,
  hasVoted,
  aadhaarVerified,
  onEnterVoting,
  onReturnToElections,
  onVerifyBlockchain,
}: VotingSectionProps) {
  const getDaysRemaining = (startDate: Date, endDate: Date) => {
    const now = new Date();

    if (now < startDate) {
      const diffTime = Math.abs(startDate.getTime() - now.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `Starts in ${diffDays} day${diffDays !== 1 ? "s" : ""}`;
    } else if (now <= endDate) {
      const diffTime = Math.abs(endDate.getTime() - now.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} remaining`;
    } else {
      return "Completed";
    }
  };

  if (hasVoted) {
    return (
      <Card className="text-center p-8 border border-green-200 bg-green-50">
        <CardContent>
          <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-green-800">
            Vote Successfully Cast
          </h2>
          <p className="text-green-700 mb-6">
            Your vote has been securely recorded on the blockchain. Thank you
            for participating in this democratic process.
          </p>
          {/* {blockchainTxHash && (
            <div className="mb-6 p-4 bg-white rounded-md border border-green-200">
              <p className="text-sm font-medium text-green-800 mb-2">
                Blockchain Transaction ID:
              </p>
              <p className="font-mono text-xs break-all">{blockchainTxHash}</p>
            </div>
          )} */}
          <div className="flex justify-center gap-4">
            <Button onClick={onReturnToElections} variant="outline">
              Return to Elections
            </Button>
            <Button onClick={onVerifyBlockchain}>
              <Shield className="h-4 w-4" />
              Verify on Blockchain
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/5 border-b">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl">Ready to Vote?</CardTitle>
            <CardDescription>
              Cast your vote in a secure, full-screen voting environment
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="px-3 py-1 bg-green-100 border-green-200"
          >
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            {getDaysRemaining(
              new Date(election.startDate),
              new Date(election.endDate)
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">
            Important Information
          </AlertTitle>
          <AlertDescription className="text-blue-700">
            You will enter a full-screen voting mode where you can review all
            candidates and cast your vote securely. Once submitted, your vote
            cannot be changed.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-muted/20 rounded-lg">
            <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="font-medium mb-1">Secure</h3>
            <p className="text-sm text-muted-foreground">
              Blockchain-secured voting
            </p>
          </div>
          <div className="text-center p-4 bg-muted/20 rounded-lg">
            <Eye className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="font-medium mb-1">Transparent</h3>
            <p className="text-sm text-muted-foreground">
              Verifiable on blockchain
            </p>
          </div>
          <div className="text-center p-4 bg-muted/20 rounded-lg">
            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="font-medium mb-1">Anonymous</h3>
            <p className="text-sm text-muted-foreground">
              Your identity is protected
            </p>
          </div>
        </div>

        <div className="text-center">
          <div className="mb-4">
            {aadhaarVerified ? (
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm">
                <CheckCircle className="h-4 w-4 mr-2" />
                Identity Verified
              </div>
            ) : (
              <div className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm">
                <Shield className="h-4 w-4 mr-2" />
                Verification Required
              </div>
            )}
          </div>

          <Button
            size="lg"
            onClick={onEnterVoting}
            className="px-8 py-3 text-lg"
          >
            <Maximize className="h-5 w-5 mr-2" />
            {aadhaarVerified ? "Enter Voting Mode" : "Verify & Vote"}
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            {aadhaarVerified
              ? "Click to start the secure voting process"
              : "Identity verification required before voting"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
