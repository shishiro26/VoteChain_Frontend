import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader } from "@/components/ui/loader";
import PartyForm from "@/components/shared/manage-parties/party-form";
import { ViewPartyDialog } from "@/components/shared/manage-parties/party-details-dialog";
import PartyLinkTable from "@/components/shared/manage-parties/party-link-table";
import Party_table from "../../components/shared/manage-parties/Party-table";
import { copyToClipboard } from "@/utils/copy_to_clipboard";
import { Copy, LinkIcon, Search, Users } from "lucide-react";
import { useGetAllPartiesQuery } from "@/api";
import { useSearchParams } from "react-router";

export default function ManagePartiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showPartyDetailsDialog, setShowPartyDetailsDialog] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);
  const page = searchParams.get("page") || "1";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handlePageChange = (newPage: number) => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      newParams.set("page", newPage.toString());
      return newParams;
    });
  };

  const { data: partiesData, isLoading } = useGetAllPartiesQuery({
    page: Number(page),
    limit: 10,
    sortBy: "createdAt:desc",
    populate: "details,partyMembers.user.userDetails,tokens",
  });

  const filteredParties = partiesData?.results ?? [];
  console.log("filteredParties", filteredParties);

  const handleViewParty = (party: Party) => {
    setSelectedParty(party);
    setShowPartyDetailsDialog(true);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Manage Political Parties</h1>

      <Tabs defaultValue="parties" className="w-full">
        <TabsList className="mb-2">
          <TabsTrigger
            value="parties"
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <Users className="w-4 h-4" /> Parties
          </TabsTrigger>
          <TabsTrigger
            value="creation-links"
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <LinkIcon className="w-4 h-4" /> Party Creation Links
          </TabsTrigger>
        </TabsList>

        <TabsContent value="parties">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search parties by name or leader..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          {isLoading ? (
            <Loader size="lg" text="Loading parties" />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Registered Political Parties</CardTitle>
                <CardDescription>
                  View and manage all political parties in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredParties.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Party_table
                      party={filteredParties}
                      handleViewParty={handleViewParty}
                    />
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      No parties found matching your search.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="creation-links">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Generate Party Creation Link</CardTitle>
              <CardDescription>
                Create a special link that allows a specific user to register a
                new political party
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PartyForm setGeneratedLink={setGeneratedLink} />
              {generatedLink && (
                <div className="mt-6 p-4 border rounded-md bg-muted">
                  <h3 className="font-medium mb-2">Generated Link</h3>
                  <div className="flex items-center gap-2">
                    <Input
                      value={generatedLink}
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generatedLink)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Share this link with the party leader to allow them to
                    complete the party registration.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Party Creation Links</CardTitle>
              <CardDescription>
                Manage all generated party creation links
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredParties.length > 0 ? (
                <div className="overflow-x-auto">
                  <PartyLinkTable party_data={filteredParties} />
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No party creation links have been generated yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {selectedParty && (
        <ViewPartyDialog
          party={selectedParty}
          onOpenChange={setShowPartyDetailsDialog}
          open={showPartyDetailsDialog}
        />
      )}
    </div>
  );
}
