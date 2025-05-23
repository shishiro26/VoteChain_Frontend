import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader } from "@/components/shared/loaders/loader";
import { ArrowLeft, Users, Clock, Calendar, MapPin, Globe } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLocation, useNavigate } from "react-router";
import PendingUserRequests from "@/components/shared/manage-parties/manage-members/pending-user-requests";
import PartyMembers from "@/components/shared/manage-parties/manage-members/party-members";
import { useWallet } from "@/store/useWallet";
import { formatDate } from "@/utils/formatDate";
import { useGetPartyMembers } from "@/api";

type PartyMember = {
  id: string;
  firstName: string;
  lastName: string;
  role: "PHEAD" | "USER";
  status: "APPROVED" | "PENDING" | "REJECTED";
  email: string;
  walletAddress: string;
  profileImage: string;
  state_name: string;
  constituency_name: string;
  createdAt: string;
  userId: string;
};

export default function ManagePartyMembersPage() {
  const { profile } = useWallet();
  const [activeTab, setActiveTab] = useState("members");
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname.split("/")[2];
  const {
    data: partyMembers,
    isLoading,
    refetch,
  } = useGetPartyMembers({
    page: 1,
    limit: 10,
    sortBy: "createdAt:desc",
    filter: { status: activeTab === "members" ? "approved" : "pending" },
  });

  if (profile?.party === null || profile?.party === undefined) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-2">
      <Button
        variant="ghost"
        onClick={() => navigate(`/parties/${pathname}`)}
        className="mb-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Party Details
      </Button>

      <div className="grid grid-cols-1 gap-6 mb-2">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border">
                <AvatarImage
                  src={profile.party.logo || "/placeholder.svg"}
                  alt={profile.party.name}
                />
                <AvatarFallback>{profile.party.symbol}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-2xl">
                    {profile.party.name}
                  </CardTitle>
                  <span className="text-2xl">{profile.party.symbol}</span>
                </div>
                <CardDescription className="mt-1">
                  Manage members and membership requests
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Founded</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(new Date(profile.party.founded_on))}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Headquarters</p>
                    <p className="text-sm text-muted-foreground">
                      {profile.party.headquarters}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Website</p>
                    <a
                      href={profile.party.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {profile.party.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 grid grid-cols-2 md:w-auto md:inline-flex">
          <TabsTrigger
            value="members"
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <Users className="w-4 h-4" /> Party Members
            <Badge variant="secondary" className="ml-1">
              {profile.party.approved_count ?? 0}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="requests"
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <Clock className="w-4 h-4" /> Membership Requests
            <Badge variant="secondary" className="ml-1">
              {profile.party.pending_count ?? 0}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader size="lg" />
            </div>
          ) : (
            <PartyMembers
              partyMembers={partyMembers as PartyMember[]}
              refetch={refetch}
            />
          )}
        </TabsContent>

        <TabsContent value="requests">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader size="lg" />
            </div>
          ) : (
            <PendingUserRequests
              partyMembers={partyMembers as PartyMember[]}
              partyId={profile.party.id}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
