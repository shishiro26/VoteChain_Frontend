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
import { useLocation, useNavigate } from "react-router";
import { useWallet } from "@/store/useWallet";
import { formatDate } from "@/utils/formatDate";
import { useJoinPartyMutation } from "@/api";
import { toast } from "sonner";
import { getPartyContract } from "@/utils/getContracts";
import { api } from "@/api/axios";
import { useState } from "react";

interface Member {
  id: string;
  name: string;
  walletAddress: string;
  role: string;
  phone: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  image: string;
}

interface PartyDetails {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  description: string;
  contact_email: string;
  contact_phone: string;
  website: string;
  abbreviation: string;
  headquarters: string;
  founded_on: string;
  facebook_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  leader_name: string;
  leader_wallet_address: string;
  leader_email: string;
  leader_image: string;
  memberStatus: "PENDING" | "APPROVED" | "REJECTED" | "NOT_MEMBER";
  members: Member[];
}

const PartyInfoCard = ({ party }: { party: PartyDetails }) => {
  const navigate = useNavigate();
  const { profile } = useWallet();
  const location = useLocation();
  const partyId = location.pathname.split("/")[2];
  const { walletAddress } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const isPartyLeader = party.leader_wallet_address === walletAddress;

  const join_party = useJoinPartyMutation();
  const handleJoinParty = async () => {
    if (party.memberStatus !== "NOT_MEMBER") return;

    try {
      setIsLoading(true);

      const partyContract = await getPartyContract();
      const tx = await partyContract.inviteMember(walletAddress);
      const receipt = await tx.wait();

      const payload = {
        transactionHash: receipt.hash,
        from: receipt.from,
        to: receipt.to,
        blockNumber: receipt.blockNumber,
        status: receipt.status === 1 ? "SUCCESS" : "FAILED",
        amount: receipt.gasUsed.toString(),
        type: "PARTY JOIN",
      };

      console.log("Transaction Receipt", receipt);
      console.log("Payload for API", payload);

      join_party.mutate(
        { partyId },
        {
          onSuccess: async () => {
            await api.post("/api/v1/auth/create-transaction", payload);
            toast.success("Party Joined Successfully!");
          },
          onError: (error) => {
            console.error("Error Joining Party", error);
            toast.error("Error joining party. Please try again.");
          },
          onSettled: () => {
            setIsLoading(false);
          },
        }
      );
    } catch (error) {
      console.error("Blockchain Error", error);
      toast.error("Transaction failed. Please try again.");
      setIsLoading(false);
    }
  };

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
              {party.members.length.toLocaleString()} registered members
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium">Founded</p>
            <p className="text-muted-foreground">
              {formatDate(new Date(party.founded_on))}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium">Contact Email</p>
            <p className="text-muted-foreground">{party.contact_email}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium">Contact Phone</p>
            <p className="text-muted-foreground">+91 {party.contact_phone}</p>
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
        {profile?.partyId && profile?.partyId !== partyId ? (
          <Button type="button" className="w-full" variant="outline" disabled>
            You are already member of {profile.party?.name}
          </Button>
        ) : !party.logo ? (
          <Button className="w-full" variant="outline" disabled>
            <Loader className="mr-2" size="sm" /> Party Verification Pending
          </Button>
        ) : isPartyLeader ? (
          <Button
            type="button"
            className="w-full"
            variant="outline"
            onClick={() => navigate(`/parties/${party.id}/edit`)}
          >
            View Candidates
          </Button>
        ) : party.memberStatus === "APPROVED" ? (
          <Button
            type="button"
            className="w-full"
            variant="outline"
            onClick={() => navigate(`/parties/${party.id}/candidates`)}
            disabled
          >
            You are a member
          </Button>
        ) : party.memberStatus === "PENDING" ? (
          <Button type="button" className="w-full" variant="outline" disabled>
            Membership Pending
          </Button>
        ) : party.memberStatus === "REJECTED" ? (
          <Button
            type="button"
            className="w-full"
            variant="destructive"
            disabled
          >
            You have been rejected
          </Button>
        ) : party.memberStatus === "NOT_MEMBER" ? (
          <Button
            type="button"
            className="w-full"
            variant="outline"
            onClick={handleJoinParty}
            disabled={join_party.isPending || isLoading}
          >
            {(join_party.isPending || isLoading) && (
              <Loader className="mr-2" size="sm" />
            )}
            Join Party
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
};

export default PartyInfoCard;
