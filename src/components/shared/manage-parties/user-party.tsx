import { useWallet } from "@/store/useWallet";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar1Icon, Users } from "lucide-react";
import { useNavigate } from "react-router";
import { getMembershipBadge } from "@/utils/status-badge";
import { formatDate } from "@/utils/formatDate";

const UserParty = () => {
  const { profile } = useWallet();
  const navigate = useNavigate();

  if (profile?.party === null || profile?.party === undefined) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>You haven't joined any parties yet</CardTitle>
          <CardDescription>
            Browse available parties to join one
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Users className="w-16 h-16 text-muted-foreground mb-4" />
          <p className="text-center text-muted-foreground mb-6">
            Joining a political party allows you to participate in internal
            elections and represent the party in national elections.
          </p>
          <Button variant="outline" onClick={() => navigate("/browse/parties")}>
            Browse Parties
          </Button>
        </CardContent>
      </Card>
    );
  }

  const party = profile.party;
  const membership =
    party.status === "PENDING"
      ? "pending"
      : party.status === "APPROVED"
      ? party.isLeader
        ? "leader"
        : "member"
      : "inactive";
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="overflow-hidden pb-0">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <img
                src={party.logo || "/placeholder.svg"}
                alt={`${party.name} logo`}
                className="w-12 h-12 rounded-full object-cover border"
              />
              <div>
                <CardTitle className="text-xl">{party.name}</CardTitle>
                <div className="mt-1">{getMembershipBadge(membership)}</div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            {party.description.slice(0, 400)}...
          </p>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar1Icon className="w-4 h-4 mr-1" /> Joined on{" "}
            {party.joinDate
              ? formatDate(new Date(party.joinDate))
              : "Not available"}
          </div>
        </CardContent>
        <CardFooter className="bg-muted/50 border-t pb  -4 flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigate(`/parties/${party.id}`)}
          >
            View Party
          </Button>
          {party.isLeader && (
            <Button onClick={() => navigate(`/parties/${party.id}/edit`)}>
              Manage Party
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserParty;
