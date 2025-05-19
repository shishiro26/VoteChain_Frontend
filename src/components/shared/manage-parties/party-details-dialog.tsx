import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Globe,
  Mail,
  Phone,
  MapPin,
  Users,
  Calendar,
  FileText,
  ExternalLink,
} from "lucide-react";
import { formatDate } from "@/utils/formatDate";

type Party = {
  id: string;
  name: string;
  symbol: string;
  abbreviation: string;
  logo: string;
  description: string;
  contact_email: string;
  contact_phone: string;
  website: string;
  leader_name: string;
  leader_wallet_address: string;
  leader_email: string;
  verify_token: null | string;
  token_url: null | string;
  token_expiry: null | string;
  candidate_count: number;
  created_at: string;
  status: string;
  link_status: string;
};

interface ViewPartyDialogProps {
  party?: Party | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// const ideology = ["Progressivism", "Social Democracy"];
const electionResults = [
  {
    year: 2020,
    election: "General Election",
    seatsWon: 50,
    totalSeats: 100,
    voteShare: 45,
  },
  {
    year: 2018,
    election: "Local Election",
    seatsWon: 30,
    totalSeats: 80,
    voteShare: 35,
  },
];

export function ViewPartyDialog({
  party,
  open,
  onOpenChange,
}: ViewPartyDialogProps) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!party) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[70vw] max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={party.logo || "/placeholder.svg"}
                alt={party.name}
              />
              <AvatarFallback>{party.symbol}</AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-2xl">{party.name}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <span>{party.abbreviation}</span>
                <span>•</span>
                <Badge
                  variant="outline"
                  className={
                    party.status === "active"
                      ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
                      : party.status === "pending"
                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200"
                      : "bg-red-100 text-red-800 hover:bg-red-100 border-red-200"
                  }
                >
                  {party.status.charAt(0).toUpperCase() + party.status.slice(1)}
                </Badge>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid grid-cols-4 mb-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="elections">Election History</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Party Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Founded
                    </h4>
                    <p className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {formatDate(new Date(party.created_at))}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      President
                    </h4>
                    <p className="flex items-center gap-2 mt-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {party.leader_name}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Email
                    </h4>
                    <p className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {party.contact_email}
                    </p>
                  </div>

                  {/* <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Ideology
                    </h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {ideology.map((ideology) => (
                        <Badge key={ideology} variant="secondary">
                          {ideology}
                        </Badge>
                      ))}
                    </div>
                  </div> */}

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Member Count
                    </h4>
                    <p className="flex items-center gap-2 mt-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {party.candidate_count.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Website
                    </h4>

                    <a
                      href={party.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 mt-1 text-primary hover:underline"
                    >
                      <Globe className="h-4 w-4" />
                      {party.website}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Email
                    </h4>
                    <a
                      href={`mailto:${party.leader_email}`}
                      className="flex items-center gap-2 mt-1 text-primary hover:underline"
                    >
                      <Mail className="h-4 w-4" />
                      {party.leader_email}
                    </a>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Phone
                    </h4>
                    <a
                      href={`tel:${party.contact_phone}`}
                      className="flex items-center gap-2 mt-1 text-primary hover:underline"
                    >
                      <Phone className="h-4 w-4" />
                      +91 {party.contact_phone}
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line">
                  {party.description}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>Party Members</CardTitle>
                <CardDescription>
                  Total members: {party.candidate_count.toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Button>View All Members</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="elections">
            <Card>
              <CardHeader>
                <CardTitle>Election Results</CardTitle>
                <CardDescription>Past performance in elections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 px-4 text-left">Year</th>
                        <th className="py-3 px-4 text-left">Election</th>
                        <th className="py-3 px-4 text-right">Seats Won</th>
                        <th className="py-3 px-4 text-right">Total Seats</th>
                        <th className="py-3 px-4 text-right">Vote Share</th>
                        <th className="py-3 px-4 text-right">Performance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {electionResults.map((result, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">{result.year}</td>
                          <td className="py-3 px-4">{result.election}</td>
                          <td className="py-3 px-4 text-right">
                            {result.seatsWon}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {result.totalSeats}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {result.voteShare}%
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Badge
                              variant="outline"
                              className={
                                result.seatsWon / result.totalSeats > 0.4
                                  ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
                                  : result.seatsWon / result.totalSeats > 0.2
                                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200"
                                  : "bg-red-100 text-red-800 hover:bg-red-100 border-red-200"
                              }
                            >
                              {result.seatsWon / result.totalSeats > 0.4
                                ? "Strong"
                                : result.seatsWon / result.totalSeats > 0.2
                                ? "Moderate"
                                : "Weak"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Party Documents</CardTitle>
                <CardDescription>
                  Official documents and certificates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span>Party Registration Certificate</span>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span>Party Constitution</span>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span>Election Commission Approval</span>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
