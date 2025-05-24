import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/utils/formatDate";

type ElectionLocation = {
  constituencyId: string;
  constituencyName: string;
  mandalName: string;
  districtName: string;
  stateName: string;
};

type Election = {
  id: string;
  title: string;
  purpose: string;
  startDate: string;
  endDate: string;
  status: "UPCOMING" | "ONGOING" | "COMPLETED";
  electionType:
    | "LOK_SABHA"
    | "VIDHAN_SABHA"
    | "MUNICIPAL"
    | "PANCHAYAT"
    | "BY_ELECTION"
    | string;
  level: "STATE" | "DISTRICT" | "MANDAL" | "CONSTITUENCY" | string;
  location: ElectionLocation;
};

const ElectionsTab = ({
  elections,
  selectedElection,
  onElectionSelect,
}: {
  elections: Election[];
  selectedElection: string | null;
  onElectionSelect: (id: string) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredElections, setFilteredElections] = useState(elections);
  const navigate = useNavigate();

  const handleElectionSearch = (term: string) => {
    setSearchTerm(term);
    const lowerTerm = term.toLowerCase();

    const filtered = elections.filter((election) => {
      const locationString = `${election.location.constituencyName} ${election.location.mandalName} ${election.location.districtName} ${election.location.stateName}`;
      return (
        election.title.toLowerCase().includes(lowerTerm) ||
        locationString.toLowerCase().includes(lowerTerm)
      );
    });

    setFilteredElections(filtered);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select an Election</CardTitle>
        <CardDescription>
          Choose an election to add party members as candidates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search elections by title or location..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => handleElectionSearch(e.target.value)}
                disabled={elections.length === 0}
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="STATE">State Elections</SelectItem>
                <SelectItem value="CONSTITUENCY">
                  Constituency Elections
                </SelectItem>
                <SelectItem value="LOCAL">Local Body Elections</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {elections.length === 0 ? (
              <div className="text-center p-4 border rounded-md bg-muted/20">
                <p className="text-muted-foreground">No elections found</p>
                <Button
                  variant="outline"
                  onClick={() => navigate("/admin/create-election")}
                  className="mt-4"
                >
                  Show All Elections
                </Button>
              </div>
            ) : filteredElections.length === 0 ? (
              <div className="text-center p-4 border rounded-md bg-muted/20">
                <p className="text-muted-foreground">
                  No elections found matching your criteria
                </p>
              </div>
            ) : (
              filteredElections.map((election) => (
                <Card
                  key={election.id}
                  className={`hover:bg-muted/20 transition-colors cursor-pointer ${
                    selectedElection === election.id
                      ? "ring-2 ring-primary/20"
                      : ""
                  }`}
                  onClick={() => onElectionSelect(election.id)}
                >
                  <CardContent>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{election.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="capitalize">
                            {election.electionType.replace("_", " ")}
                          </Badge>
                          <Badge
                            variant={
                              election.status === "UPCOMING"
                                ? "outline"
                                : election.status === "ONGOING"
                                ? "default"
                                : "secondary"
                            }
                            className="capitalize"
                          >
                            {election.status.toLowerCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Location: {election.location.constituencyName},{" "}
                          {election.location.mandalName},{" "}
                          {election.location.districtName},{" "}
                          {election.location.stateName}
                        </p>
                        <p className="text-sm mt-1">
                          Date: {formatDate(new Date(election.startDate))} -{" "}
                          {formatDate(new Date(election.endDate))}
                        </p>
                      </div>
                      <div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onElectionSelect(election.id)}
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Add Candidates
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ElectionsTab;
