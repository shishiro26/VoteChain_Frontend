import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, FileText, CrownIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { Loader } from "@/components/ui/loader";
import PartyInfoCard from "@/components/shared/profile/party-info-card";
import { useWallet } from "@/store/useWallet";
import { useGetPartyDetailsByWalletId } from "@/api";
import { getMembershipBadge, getPartyStatusBadge } from "@/utils/status-badge";

interface Member {
  id: string;
  name: string;
  walletAddress: string;
  role: string;
  phone: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  image: string;
}

export default function PartyDetailsPage() {
  const { walletAddress } = useWallet();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname.split("/")[2];

  const { data: partyData, isLoading } = useGetPartyDetailsByWalletId(
    pathname,
    walletAddress ? walletAddress : ""
  );

  if (isLoading || !partyData) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[50vh]">
        <Loader size="lg" text="Loading party details..." />
      </div>
    );
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const filteredMembers = partyData.members?.filter(
    (member: Member) => member.status === "APPROVED"
  );

  return (
    <div className="container mx-auto px-4 py-4">
      <Button
        variant="ghost"
        onClick={() => navigate("/browse/parties")}
        className="mb-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Parties
      </Button>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          <Card className="mb-8">
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={partyData.logo || "/placeholder.svg"}
                    alt={`${partyData.name} logo`}
                    className="w-16 h-16 rounded-full object-cover border"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-2xl">
                        {partyData.name}
                      </CardTitle>
                      {getPartyStatusBadge(
                        partyData.logo ? "active" : "pending"
                      )}
                    </div>
                    <CardDescription className="mt-1">
                      {partyData.abbreviation} • Founded in{" "}
                      {new Date(partyData.founded_on).toLocaleDateString()}
                    </CardDescription>
                  </div>
                </div>
                {getMembershipBadge(partyData.memberStatus.toLowerCase())}
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="mb-2">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="leadership">Leadership</TabsTrigger>
                  <TabsTrigger value="candidates">
                    Recent Candidates
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="about">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Description</h3>
                      <p className="text-muted-foreground">
                        {partyData.description}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Ideology</h3>
                      <p className="text-muted-foreground">
                        Democratic, Progressive, Center-left
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        Party Manifesto
                      </h3>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" /> View Manifesto
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="leadership">
                  <Card className="min-w-fit max-w-1/2">
                    <CardContent className="p-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={partyData.leader_image || "/placeholder.svg"}
                          alt={partyData.leader_name}
                          className="w-12 h-12 rounded-full object-cover border"
                        />
                        <div>
                          <h4 className="font-medium">
                            {partyData.leader_name}
                          </h4>
                          <p className="text-sm text-muted-foreground flex items-center">
                            <CrownIcon className="h-4 w-4 mr-2" /> Party Leader
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="candidates">
                  <div className="space-y-4 max-h-[55vh] overflow-y-auto">
                    {filteredMembers.recentCandidates?.length === 0 ? (
                      <p className="text-muted-foreground">
                        No recent candidates found.
                      </p>
                    ) : (
                      filteredMembers?.map((member: Member) => (
                        <Card key={member.name} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={member.image || "/placeholder.svg"}
                                alt={member.name || "Member"}
                                className="w-12 h-12 rounded-full object-cover border"
                              />
                              <div>
                                <h4 className="font-medium">{member.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {truncateAddress(member.walletAddress)} •{" "}
                                  {member.role === "PHEAD" ? (
                                    <span className="text-primary">
                                      Party Head
                                    </span>
                                  ) : (
                                    member.role.toLocaleUpperCase()
                                  )}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-1/3">
          <PartyInfoCard party={partyData} />
        </div>
      </div>
    </div>
  );
}
