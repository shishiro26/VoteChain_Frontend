import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  CheckCircle,
  Clock,
  Filter,
  MapPin,
  Search,
  VoteIcon,
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
import { Link, useNavigate } from "react-router";
import { useWallet } from "@/store/useWallet";
// Election model type
interface Election {
  id: string;
  title: string;
  purpose: string;
  start_date: Date;
  end_date: Date;
  state: string;
  status: number; // 0 = Upcoming, 1 = Ongoing, 2 = Completed
  total_votes: number;
  constituency_id: string;
  constituency_name: string; // Assume populated
  district: string;
  created_at: Date;
  updated_at: Date;
}

// Sample elections data
const SAMPLE_ELECTIONS: Election[] = [
  {
    id: "1",
    title: "National General Election 2023",
    purpose: "Election of Members of Parliament",
    start_date: new Date("2023-11-01"),
    end_date: new Date("2023-11-30"),
    state: "Delhi",
    status: 1, // Ongoing
    total_votes: 12500,
    constituency_id: "c1",
    constituency_name: "New Delhi",
    district: "New Delhi",
    created_at: new Date("2023-10-01"),
    updated_at: new Date("2023-10-01"),
  },
  {
    id: "2",
    title: "Maharashtra State Assembly Election",
    purpose: "Election of Members of Legislative Assembly",
    start_date: new Date("2023-12-01"),
    end_date: new Date("2023-12-15"),
    state: "Maharashtra",
    status: 0, // Upcoming
    total_votes: 0,
    constituency_id: "c2",
    constituency_name: "Mumbai South",
    district: "Mumbai City",
    created_at: new Date("2023-10-15"),
    updated_at: new Date("2023-10-15"),
  },
  {
    id: "3",
    title: "Karnataka Municipal Corporation Election",
    purpose: "Election of Municipal Corporation Members",
    start_date: new Date("2023-09-01"),
    end_date: new Date("2023-09-15"),
    state: "Karnataka",
    status: 2, // Completed
    total_votes: 8750,
    constituency_id: "c3",
    constituency_name: "Bengaluru Central",
    district: "Bengaluru Urban",
    created_at: new Date("2023-08-01"),
    updated_at: new Date("2023-09-16"),
  },
  {
    id: "4",
    title: "Delhi Municipal Corporation Election",
    purpose: "Election of Municipal Corporation Members",
    start_date: new Date("2023-10-15"),
    end_date: new Date("2023-11-15"),
    state: "Delhi",
    status: 1, // Ongoing
    total_votes: 5200,
    constituency_id: "c4",
    constituency_name: "South Delhi",
    district: "South Delhi",
    created_at: new Date("2023-09-01"),
    updated_at: new Date("2023-09-01"),
  },
  {
    id: "5",
    title: "Uttar Pradesh By-Election",
    purpose: "By-election for vacant Assembly seat",
    start_date: new Date("2023-11-20"),
    end_date: new Date("2023-11-25"),
    state: "Uttar Pradesh",
    status: 0, // Upcoming
    total_votes: 0,
    constituency_id: "c5",
    constituency_name: "Lucknow East",
    district: "Lucknow",
    created_at: new Date("2023-10-20"),
    updated_at: new Date("2023-10-20"),
  },
  {
    id: "6",
    title: "Tamil Nadu Local Body Election",
    purpose: "Election of Panchayat members",
    start_date: new Date("2023-08-10"),
    end_date: new Date("2023-08-20"),
    state: "Tamil Nadu",
    status: 2, // Completed
    total_votes: 6300,
    constituency_id: "c6",
    constituency_name: "Chennai North",
    district: "Chennai",
    created_at: new Date("2023-07-15"),
    updated_at: new Date("2023-08-21"),
  },
];

// List of Indian states for filter
const INDIAN_STATES = [
  "All States",
  "Andhra Pradesh",
  "Delhi",
  "Karnataka",
  "Maharashtra",
  "Tamil Nadu",
  "Uttar Pradesh",
  // Add more as needed
];

// List of constituencies for filter
const CONSTITUENCIES = [
  "All Constituencies",
  "New Delhi",
  "Mumbai South",
  "Bengaluru Central",
  "South Delhi",
  "Lucknow East",
  "Chennai North",
  // Add more as needed
];

export default function VotePage() {
  const { wallet, is_profile_complete } = useWallet();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState("All States");
  const [statusFilter, setStatusFilter] = useState("All");
  const [constituencyFilter, setConstituencyFilter] =
    useState("All Constituencies");
  const [purposeFilter, setPurposeFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState<Date | undefined>(
    undefined
  );
  const [endDateFilter, setEndDateFilter] = useState<Date | undefined>(
    undefined
  );
  const [filteredElections, setFilteredElections] =
    useState<Election[]>(SAMPLE_ELECTIONS);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  useEffect(() => {
    if (!wallet) {
      navigate("/");
    } else if (!is_profile_complete) {
      navigate("/update-profile");
    }
  }, [wallet, is_profile_complete, navigate]);

  // Filter elections based on search term and filters
  useEffect(() => {
    let result = SAMPLE_ELECTIONS;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (election) =>
          election.title.toLowerCase().includes(term) ||
          election.purpose.toLowerCase().includes(term)
      );
    }

    // Apply state filter
    if (stateFilter !== "All States") {
      result = result.filter((election) => election.state === stateFilter);
    }

    // Apply status filter
    if (statusFilter !== "All") {
      const statusValue = Number.parseInt(statusFilter);
      result = result.filter((election) => election.status === statusValue);
    }

    // Apply constituency filter
    if (constituencyFilter !== "All Constituencies") {
      result = result.filter(
        (election) => election.constituency_name === constituencyFilter
      );
    }

    // Apply purpose filter
    if (purposeFilter) {
      result = result.filter((election) =>
        election.purpose.toLowerCase().includes(purposeFilter.toLowerCase())
      );
    }

    // Apply start date filter
    if (startDateFilter) {
      result = result.filter(
        (election) => election.start_date >= startDateFilter
      );
    }

    // Apply end date filter
    if (endDateFilter) {
      result = result.filter((election) => election.end_date <= endDateFilter);
    }

    setFilteredElections(result);
  }, [
    searchTerm,
    stateFilter,
    statusFilter,
    constituencyFilter,
    purposeFilter,
    startDateFilter,
    endDateFilter,
  ]);

  // Helper function to render status badge
  const renderStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return (
          <Badge
            variant="outline"
            className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200"
          >
            <Clock className="h-3 w-3 mr-1" />
            Upcoming
          </Badge>
        );
      case 1:
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Ongoing
          </Badge>
        );
      case 2:
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStateFilter("All States");
    setStatusFilter("All");
    setConstituencyFilter("All Constituencies");
    setPurposeFilter("");
    setStartDateFilter(undefined);
    setEndDateFilter(undefined);
  };

  if (!wallet) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Wallet Not Connected</CardTitle>
            <CardDescription>
              Please connect your MetaMask wallet to access the voting page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/")} className="w-full">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!is_profile_complete) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Profile Incomplete</CardTitle>
            <CardDescription>
              Please complete your profile before accessing the voting page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate("/update-profile")}
              className="w-full"
            >
              Update Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Available Elections
      </h1>

      {/* Search and Basic Filters */}
      <div className="mb-8 space-y-4">
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
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-40">
              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="State" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {INDIAN_STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-40">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="0">Upcoming</SelectItem>
                  <SelectItem value="1">Ongoing</SelectItem>
                  <SelectItem value="2">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              className="w-full sm:w-auto"
            >
              {isFilterExpanded ? "Hide Filters" : "More Filters"}
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {isFilterExpanded && (
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Constituency
                </label>
                <Select
                  value={constituencyFilter}
                  onValueChange={setConstituencyFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select constituency" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONSTITUENCIES.map((constituency) => (
                      <SelectItem key={constituency} value={constituency}>
                        {constituency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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

      {/* Elections List */}
      {filteredElections.length === 0 ? (
        <Card className="text-center p-8">
          <CardContent>
            <p className="text-muted-foreground">
              No elections found matching your criteria.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredElections.map((election) => (
            <Card
              key={election.id}
              className="hover:shadow-lg transition-shadow border border-border"
            >
              <CardHeader className="bg-primary/5 border-b border-border">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{election.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {election.purpose}
                    </CardDescription>
                  </div>
                  <div>{renderStatusBadge(election.status)}</div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {format(election.start_date, "MMM d, yyyy")} -{" "}
                      {format(election.end_date, "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {election.state}, {election.district},{" "}
                      {election.constituency_name}
                    </span>
                  </div>
                  {election.status === 1 && (
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">
                        {election.total_votes}
                      </span>{" "}
                      votes cast so far
                    </div>
                  )}
                  {election.status === 2 && (
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">
                        {election.total_votes}
                      </span>{" "}
                      total votes
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t border-border pt-4">
                <Link to={`/vote/${election.id}`} className="w-full">
                  <Button
                    className="w-full"
                    variant={election.status === 1 ? "default" : "outline"}
                    disabled={election.status !== 1}
                  >
                    {election.status === 1 ? (
                      <>
                        <VoteIcon className="h-4 w-4 mr-2" /> Vote Now
                      </>
                    ) : election.status === 0 ? (
                      <>
                        <Clock className="h-4 w-4 mr-2" /> View Details
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" /> View Results
                      </>
                    )}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
