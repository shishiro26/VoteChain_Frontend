import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Loader } from "@/components/ui/loader";
import { Users, Calendar, Mail, Phone, Globe } from "lucide-react";
import { useNavigate } from "react-router";
import { useWallet } from "@/store/useWallet";
import { useAuth } from "@/hooks/use-auth";

export type Leader = {
  name: string;
  position: string;
  image: string;
  wallet_address: string;
};

export type Candidate = {
  name: string;
  constituency: string;
  election: string;
  image: string;
};

export type Party = {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  members: number;
  description: string;
  status: "pending" | "active" | "expired" | "verified";
  founded: string;
  ideology: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  manifesto: boolean;
  leaders: Leader[];
  recentCandidates: Candidate[];
};

const PartyInfoCard = ({ party }: { party: Party }) => {
  const navigate = useNavigate();
  const { wallet } = useWallet();
  const { checkIsPartyLeader } = useAuth();
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Party Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <Users className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium">Members</p>
            <p className="text-muted-foreground">
              {party.members.toLocaleString()} registered members
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium">Founded</p>
            <p className="text-muted-foreground">{party.founded}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium">Contact Email</p>
            <p className="text-muted-foreground">{party.contactEmail}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium">Contact Phone</p>
            <p className="text-muted-foreground">+91 {party.contactPhone}</p>
          </div>
        </div>

        {party.website && (
          <div className="flex items-start gap-3">
            <Globe className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Website</p>
              <a
                href={party.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {party.website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4">
        {party.status === "pending" ? (
          <Button className="w-full" variant={"outline"} disabled>
            <Loader className="mr-2" size="sm" /> Party Verification Pending
          </Button>
        ) : party.leaders[0].wallet_address === wallet && checkIsPartyLeader ? (
          <Button
            type="button"
            className="w-full"
            variant="outline"
            onClick={() => navigate(`/parties/${party.id}/edit`)}
            disabled={false}
          >
            View Candidates
          </Button>
        ) : !checkIsPartyLeader ? (
          <Button
            type="button"
            className="w-full"
            variant="outline"
            onClick={() => navigate(`/parties/${party.id}/candidates`)}
            disabled={false}
          >
            Join Party
          </Button>
        ) : (
          <Button
            type="button"
            className="w-full"
            variant="outline"
            onClick={() => navigate(`/parties/${party.id}/candidates`)}
            disabled={false}
          >
            View Candidates
          </Button>
        )}
        {/* {!membershipStatus ? (
          <Button
            className="w-full"
            onClick={handleJoinParty}
            disabled={isJoining}
          >
            {isJoining ? (
              <>
                <Loader className="mr-2" size="sm" /> Joining...
              </>
            ) : (
              <>Join Party</>
            )}
          </Button>
        ) : membershipStatus === "pending" ? (
          <Button variant="outline" className="w-full" disabled>
            <Clock className="mr-2 h-4 w-4" /> Membership Pending
          </Button>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full text-destructive hover:text-destructive"
              >
                Leave Party
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Leave Party</DialogTitle>
                <DialogDescription>
                  Are you sure you want to leave {party.name}? This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => {}}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleLeaveParty}
                  disabled={isLeaving}
                >
                  {isLeaving ? (
                    <>
                      <Loader className="mr-2" size="sm" /> Leaving...
                    </>
                  ) : (
                    <>Confirm Leave</>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )} */}
      </CardFooter>
    </Card>
  );
};

export default PartyInfoCard;
