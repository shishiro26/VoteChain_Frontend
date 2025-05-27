import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Users, UserIcon, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate, useSearchParams } from "react-router";
import { useGetAllPartiesQuery } from "@/api";
import { formatDate } from "@/utils/formatDate";
import { Loader } from "@/components/ui/loader";
import { getPartyStatusBadge } from "@/utils/status-badge";
import UserParty from "@/components/shared/manage-parties/user-party";
import Pagination from "@/components/shared/pagination";

export default function PartiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("browse");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const { data, isLoading } = useGetAllPartiesQuery({
    page: Number(currentPage),
    limit: 6,
    sortBy: "createdAt:desc",
    populate: "details,partyMembers.user.userDetails,tokens",
  });

  const filteredParties = data?.data.results ?? [];

  const totalPages = data?.query?.totalPages || 1;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      searchParams.set("page", page.toString());
      setSearchParams(searchParams);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Political Parties</h1>
          <p className="text-muted-foreground mt-1">
            Join an existing party or request to create your own
          </p>
        </div>
      </div>
      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertDescription>
          To create a new political party, please contact the election
          commission. Only authorized users with a special link can register new
          parties.
        </AlertDescription>
      </Alert>
      <Tabs
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6">
          <TabsTrigger
            value="browse"
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <Users className="w-4 h-4" /> Browse Parties
          </TabsTrigger>
          <TabsTrigger
            value="my-parties"
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <UserIcon className="w-4 h-4" /> My Parties
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search parties..."
                className="pl-10 w-1/2"
                disabled={isLoading}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          {isLoading ? (
            <Loader size="lg" text="Loading parties..." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredParties.map((party: Party) => (
                <Card key={party.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <img
                          src={party.logo || "/placeholder.svg"}
                          alt={`${party.name} logo`}
                          className="w-12 h-12 rounded-full object-cover border"
                        />
                        <div>
                          <CardTitle className="text-xl">
                            {party.name}
                          </CardTitle>
                          <CardDescription>
                            Founded {formatDate(new Date(party.founded_on))}
                          </CardDescription>
                        </div>
                      </div>
                      {getPartyStatusBadge(party.logo ? "active" : "pending")}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                      {party.description}
                    </p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="w-4 h-4 mr-1" />{" "}
                      {party.partyMembersCount.toLocaleString()} members
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/50 border-t pt-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        navigate(`/parties/${party.id}`);
                      }}
                      disabled={party.logo ? false : true}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {filteredParties.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No parties found matching your search.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-parties">
          <UserParty />
        </TabsContent>
      </Tabs>
      {totalPages > 1 && activeTab === "browse" && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          goToPage={goToPage}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
        />
      )}
    </div>
  );
}
