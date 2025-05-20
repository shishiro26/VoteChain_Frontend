import { useNavigate } from "react-router";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Users } from "lucide-react";
import NoAffiliationCard from "./no-affiliation-card";

const userData = {
  partyAffiliation: {
    partyName: "Progressive Party",
    partySymbol: "PP",
    partyLogo: "/path/to/logo.png",
    membershipId: "123456",
    joinDate: "2022-01-01",
    role: "Leader",
  },
};

const PartyStats = () => (
  <div className="mt-8 p-4 bg-muted rounded-lg">
    <h4 className="font-medium mb-2 flex items-center gap-2">
      <Users className="h-4 w-4" />
      Party Statistics
    </h4>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-3 bg-background rounded-md">
        <p className="text-sm text-muted-foreground">Total Members</p>
        <p className="text-xl font-bold">42</p>
      </div>
      <div className="p-3 bg-background rounded-md">
        <p className="text-sm text-muted-foreground">Pending Requests</p>
        <p className="text-xl font-bold">7</p>
      </div>
      <div className="p-3 bg-background rounded-md">
        <p className="text-sm text-muted-foreground">Active Candidates</p>
        <p className="text-xl font-bold">12</p>
      </div>
      <div className="p-3 bg-background rounded-md">
        <p className="text-sm text-muted-foreground">Elections Won</p>
        <p className="text-xl font-bold">3</p>
      </div>
    </div>
  </div>
);

const UserParty = () => {
  const navigate = useNavigate();
  const { partyAffiliation } = userData;

  const renderActionButtons = () => {
    if (!partyAffiliation) return null;

    return partyAffiliation.role === "Leader" ? (
      <>
        <Button
          onClick={() =>
            navigate(`/parties/${partyAffiliation.membershipId}/manage`)
          }
        >
          Manage Party
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            navigate(`/parties/${partyAffiliation.membershipId}/manage-members`)
          }
        >
          Manage Members
        </Button>
      </>
    ) : (
      <Button
        onClick={() => navigate(`/parties/${partyAffiliation.membershipId}`)}
      >
        View Party Details
      </Button>
    );
  };

  if (!partyAffiliation) {
    return <NoAffiliationCard link="/parties" />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Party Affiliation</CardTitle>
            <CardDescription>
              Your political party membership details
            </CardDescription>
          </div>
          {partyAffiliation.role === "Leader" && (
            <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
              Party Leader
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-lg border overflow-hidden flex items-center justify-center bg-muted">
              <div className="relative w-full h-full">
                <img
                  src={partyAffiliation.partyLogo || "/placeholder.svg"}
                  alt={partyAffiliation.partyName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 right-0 bg-background/80 p-1 rounded-tl-md text-2xl">
                  {partyAffiliation.partySymbol}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-grow space-y-4">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                {partyAffiliation.partyName}
                <span className="text-2xl">{partyAffiliation.partySymbol}</span>
              </h3>
              <p className="text-muted-foreground">
                A progressive party focused on democratic values and social
                justice
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Membership ID</p>
                <p className="font-medium">{partyAffiliation.membershipId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Join Date</p>
                <p className="font-medium">{partyAffiliation.joinDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-medium">{partyAffiliation.role}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge
                  variant="outline"
                  className="bg-green-500/10 text-green-700"
                >
                  Active
                </Badge>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex flex-wrap gap-3">
              {renderActionButtons()}
              <Button variant="secondary">
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Blockchain
              </Button>
            </div>
          </div>
        </div>

        {partyAffiliation.role === "Leader" && <PartyStats />}
      </CardContent>
    </Card>
  );
};

export default UserParty;
