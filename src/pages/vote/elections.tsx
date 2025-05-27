import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  Filter,
  MapPin,
  Search,
  VoteIcon,
  Users,
  BarChart3,
} from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link, useSearchParams } from "react-router";
import {
  getElectionImportanceBadge,
  getElectionStatusPage,
} from "@/utils/status-badge";
import ElectionAlert from "@/components/shared/elections/election-alert";
import { useGetElectionsByConstituencyQuery } from "@/api";
import { Loader } from "@/components/ui/loader";
import { formatDate } from "@/utils/formatDate";
import { useWallet } from "@/store/useWallet";
import { Progress } from "@/components/ui/progress";
import Pagination from "@/components/shared/pagination";
import { getDaysRemaining, getTimeProgress } from "@/utils/election";

type Election = {
  id: string;
  title: string;
  purpose: string;
  startDate: string;
  endDate: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  electionType:
    | "LOK_SABHA"
    | "VIDHAN_SABHA"
    | "MUNICIPAL"
    | "PANCHAYAT"
    | "BY_ELECTION";

  status: "ONGOING" | "UPCOMING" | "COMPLETED";
  level: "STATE" | "CONSTITUENCY";
  candidates_count: number;
  votes_count: number;
  totalVoters: number;
  constituency: {
    id: string;
    name: string;
  };
};

export default function VotePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [purposeFilter, setPurposeFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState<Date | undefined>(
    undefined
  );
  const [endDateFilter, setEndDateFilter] = useState<Date | undefined>(
    undefined
  );
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "importance" | "votes">("date");
  const [currentTab, setCurrentTab] = useState("all");
  const { profile } = useWallet();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const { data, isLoading } = useGetElectionsByConstituencyQuery({
    page: currentPage,
    limit: 6,
    sortBy: "createdAt:desc",
  });

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

  const filteredElections = useMemo(() => {
    const elections: Election[] = data?.data || [];
    let result = elections;

    if (currentTab === "ongoing") {
      result = result.filter((election) => election.status === "ONGOING");
    } else if (currentTab === "upcoming") {
      result = result.filter((election) => election.status === "UPCOMING");
    } else if (currentTab === "completed") {
      result = result.filter((election) => election.status === "COMPLETED");
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (election) =>
          election.title.toLowerCase().includes(term) ||
          election.purpose.toLowerCase().includes(term)
      );
    }

    if (purposeFilter) {
      result = result.filter((election) =>
        election.purpose.toLowerCase().includes(purposeFilter.toLowerCase())
      );
    }

    // Apply start date filter
    if (startDateFilter) {
      result = result.filter(
        (election) => new Date(election.startDate) >= startDateFilter
      );
    }

    // Apply end date filter
    if (endDateFilter) {
      result = result.filter(
        (election) => new Date(election.endDate) <= endDateFilter
      );
    }

    // Apply sorting
    if (sortBy === "date") {
      result = [...result].sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
    } else if (sortBy === "importance") {
      const priority = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      result = [...result].sort(
        (a, b) => priority[b.priority] - priority[a.priority]
      );
    } else if (sortBy === "votes") {
      result = [...result].sort((a, b) => b.votes_count - a.votes_count);
    }

    return result;
  }, [
    data?.data,
    currentTab,
    searchTerm,
    purposeFilter,
    startDateFilter,
    endDateFilter,
    sortBy,
  ]);

  const resetFilters = () => {
    setSearchTerm("");
    setPurposeFilter("");
    setStartDateFilter(undefined);
    setEndDateFilter(undefined);
  };

  if (!profile) {
    return null;
  }

  const getVoteProgress = (totalVotes: number, targetVotes: number) => {
    console.log(
      `Calculating vote progress: totalVotes=${totalVotes}, targetVotes=${targetVotes}`
    );
    return Math.min(Math.round((totalVotes / targetVotes) * 100), 100);
  };

  const upcomingElectionsCount = filteredElections.filter(
    (e) => e.status === "UPCOMING"
  ).length;
  const ongoingElectionsCount = filteredElections.filter(
    (e) => e.status === "ONGOING"
  ).length;

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h1 className="text-3xl font-bold mb-2 md:mb-0">Available Elections</h1>
      </div>

      <ElectionAlert count={upcomingElectionsCount} type="upcoming" />
      <ElectionAlert count={ongoingElectionsCount} type="ongoing" />

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="mb-2">
        <div className="flex justify-between items-center mb-2">
          <TabsList>
            <TabsTrigger value="all">All Elections</TabsTrigger>
            <TabsTrigger value="ongoing">
              Ongoing
              <span className="ml-1 text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">
                {ongoingElectionsCount}
              </span>
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              Upcoming
              <span className="ml-1 text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">
                {upcomingElectionsCount}
              </span>
            </TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <Select
            value={sortBy}
            onValueChange={(value: "date" | "importance" | "votes") =>
              setSortBy(value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Sort by Date</SelectItem>
              <SelectItem value="importance">Sort by Importance</SelectItem>
              <SelectItem value="votes">Sort by Votes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Tabs>

      <div className="mb-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search elections by title or purpose..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            className="w-full sm:w-auto"
          >
            {isFilterExpanded ? "Hide Filters" : "More Filters"}
          </Button>
        </div>

        {isFilterExpanded && (
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Purpose Keyword
                </label>
                <Input
                  placeholder="e.g. Municipal, Assembly"
                  value={purposeFilter}
                  onChange={(e) => setPurposeFilter(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Start Date (From)
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDateFilter && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDateFilter ? (
                        format(startDateFilter, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={startDateFilter}
                      onSelect={setStartDateFilter}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  End Date (To)
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDateFilter && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDateFilter ? (
                        format(endDateFilter, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={endDateFilter}
                      onSelect={setEndDateFilter}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={resetFilters} size="sm">
                Reset Filters
              </Button>
            </div>
          </Card>
        )}
      </div>
      {isLoading ? (
        <Loader size="lg" text="Loading elections..." />
      ) : filteredElections.length === 0 ? (
        <Card className="text-center p-8 mb-2">
          <CardContent>
            <p className="text-muted-foreground">
              {searchTerm
                ? `No elections found for "${searchTerm}"`
                : `No elections in ${profile?.location.constituency}.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredElections.map((election) => (
            <Card
              key={election.id}
              className="hover:shadow-lg transition-shadow border border-border overflow-hidden pt-0"
            >
              <CardHeader className="bg-primary/5 border-b border-border pb-2 pt-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{election.title}</CardTitle>
                    <CardDescription className="mt-1">
                      <CardDescription>
                        {election.purpose.length > 60
                          ? election.purpose.slice(0, 57) + "..."
                          : election.purpose}
                      </CardDescription>
                    </CardDescription>
                  </div>
                  <div>{getElectionStatusPage(election.status)}</div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 pb-2">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        {formatDate(new Date(election.startDate))} -{" "}
                        {formatDate(new Date(election.endDate))}
                      </span>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="text-sm font-medium text-primary">
                            {getDaysRemaining(
                              new Date(election.startDate),
                              new Date(election.endDate)
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Time remaining for this election</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  {election.status === "ONGOING" && (
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span className="mr-1">Progress</span>
                        <span>
                          {getTimeProgress(
                            new Date(election.startDate),
                            new Date(election.endDate)
                          )}
                          %
                        </span>
                        <Progress
                          value={getTimeProgress(
                            new Date(election.startDate),
                            new Date(election.endDate)
                          )}
                          className="h-1.5"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{election.constituency.name}</span>
                    </div>
                    {getElectionImportanceBadge(election.priority)}
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{election.candidates_count} Candidates</span>
                    </div>
                    {(election.status === "ONGOING" ||
                      election.status === "COMPLETED") && (
                      <div className="text-muted-foreground">
                        <span className="font-medium">
                          {election.votes_count}
                        </span>{" "}
                        votes
                      </div>
                    )}
                  </div>

                  {election.status === "ONGOING" && (
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span className="text-nowrap mr-1">Voter Turnout</span>
                        <span>
                          {getVoteProgress(
                            election.votes_count,
                            election.totalVoters
                          )}
                          %
                        </span>

                        <Progress
                          value={getVoteProgress(
                            election.votes_count,
                            election.totalVoters
                          )}
                          className="h-1.5"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t border-border">
                <Link to={`/vote/${election.id}`} className="w-full">
                  <Button
                    className="w-full"
                    variant={
                      election.status === "ONGOING" ? "default" : "outline"
                    }
                    disabled={election.status !== "ONGOING"}
                  >
                    {election.status === "ONGOING" ? (
                      <>
                        <VoteIcon className="h-4 w-4 mr-2" /> Vote Now
                      </>
                    ) : election.status === "UPCOMING" ? (
                      <>
                        <Clock className="h-4 w-4 mr-2" /> View Details
                      </>
                    ) : (
                      <>
                        <BarChart3 className="h-4 w-4 mr-2" /> View Results
                      </>
                    )}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
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
