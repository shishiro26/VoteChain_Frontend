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

type Candidate = {
  image: string;
  name: string;
  constituency: string;
  election: string;
};

export default function PartyDetailsPage() {
  const { wallet } = useWallet();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname.split("/")[2];

  const { data: partyData, isLoading } = useGetPartyDetailsByWalletId(
    pathname,
    wallet ? wallet : ""
  );

  if (isLoading || !partyData) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[50vh]">
        <Loader size="lg" text="Loading party details..." />
      </div>
    );
  }

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
                      {getPartyStatusBadge(partyData.status)}
                    </div>
                    <CardDescription className="mt-1">
                      {partyData.shortName} • Founded in {partyData.founded}
                    </CardDescription>
                  </div>
                </div>
                {getMembershipBadge("leader")}
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
                          src={partyData.leaders[0].image || "/placeholder.svg"}
                          alt={partyData.leaders[0].name}
                          className="w-12 h-12 rounded-full object-cover border"
                        />
                        <div>
                          <h4 className="font-medium">
                            {partyData.leaders[0].name}
                          </h4>
                          <p className="text-sm text-muted-foreground flex items-center">
                            <CrownIcon className="h-4 w-4 mr-2" />{" "}
                            {partyData.leaders[0].position}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="candidates">
                  <div className="space-y-4 max-h-[55vh] overflow-y-auto">
                    {partyData.recentCandidates?.length === 0 ? (
                      <p className="text-muted-foreground">
                        No recent candidates found.
                      </p>
                    ) : (
                      partyData.recentCandidates?.map(
                        (candidate: Candidate) => (
                          <Card
                            key={candidate.name}
                            className="overflow-hidden"
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={candidate.image || "/placeholder.svg"}
                                  alt={candidate.name || "Candidate"}
                                  className="w-12 h-12 rounded-full object-cover border"
                                />
                                <div>
                                  <h4 className="font-medium">
                                    {candidate.name}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {candidate.constituency} •{" "}
                                    {candidate.election}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      )
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
