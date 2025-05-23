import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  CheckCircle,
  ChevronLeft,
  Clock,
  Crown,
  MapPin,
  Users,
  VoteIcon,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";
import { Link } from "react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWallet } from "@/store/useWallet";

// Election model type
interface Election {
  id: string;
  title: string;
  purpose: string;
  start_date: Date;
  end_date: Date;
  state: string;
  district: string;
  status: number; // 0 = Upcoming, 1 = Ongoing, 2 = Completed
  total_votes: number;
  constituency_id: string;
  constituency_name: string; // Assume populated
  created_at: Date;
  updated_at: Date;
  voters?: string[]; // Array of wallet addresses that have voted
}

// Candidate model type
interface Candidate {
  id: string;
  name: string;
  party: string;
  image: string;
  description?: string;
  election_id: string;
  votes: number;
}

// Sample elections data
const SAMPLE_ELECTIONS: Record<string, Election> = {
  "1": {
    id: "1",
    title: "National General Election 2023",
    purpose: "Election of Members of Parliament",
    start_date: new Date("2023-11-01"),
    end_date: new Date("2023-11-30"),
    state: "Delhi",
    district: "New Delhi",
    status: 1, // Ongoing
    total_votes: 12500,
    constituency_id: "c1",
    constituency_name: "New Delhi",
    created_at: new Date("2023-10-01"),
    updated_at: new Date("2023-10-01"),
    voters: [],
  },
  "2": {
    id: "2",
    title: "Maharashtra State Assembly Election",
    purpose: "Election of Members of Legislative Assembly",
    start_date: new Date("2023-12-01"),
    end_date: new Date("2023-12-15"),
    state: "Maharashtra",
    district: "Mumbai City",
    status: 0, // Upcoming
    total_votes: 0,
    constituency_id: "c2",
    constituency_name: "Mumbai South",
    created_at: new Date("2023-10-15"),
    updated_at: new Date("2023-10-15"),
    voters: [],
  },
  "3": {
    id: "3",
    title: "Karnataka Municipal Corporation Election",
    purpose: "Election of Municipal Corporation Members",
    start_date: new Date("2023-09-01"),
    end_date: new Date("2023-09-15"),
    state: "Karnataka",
    district: "Bengaluru Urban",
    status: 2, // Completed
    total_votes: 8750,
    constituency_id: "c3",
    constituency_name: "Bengaluru Central",
    created_at: new Date("2023-08-01"),
    updated_at: new Date("2023-09-16"),
    voters: [],
  },
  "4": {
    id: "4",
    title: "Delhi Municipal Corporation Election",
    purpose: "Election of Municipal Corporation Members",
    start_date: new Date("2023-10-15"),
    end_date: new Date("2023-11-15"),
    state: "Delhi",
    district: "South Delhi",
    status: 1, // Ongoing
    total_votes: 5200,
    constituency_id: "c4",
    constituency_name: "South Delhi",
    created_at: new Date("2023-09-01"),
    updated_at: new Date("2023-09-01"),
    voters: [],
  },
  "5": {
    id: "5",
    title: "Uttar Pradesh By-Election",
    purpose: "By-election for vacant Assembly seat",
    start_date: new Date("2023-11-20"),
    end_date: new Date("2023-11-25"),
    state: "Uttar Pradesh",
    district: "Lucknow",
    status: 0, // Upcoming
    total_votes: 0,
    constituency_id: "c5",
    constituency_name: "Lucknow East",
    created_at: new Date("2023-10-20"),
    updated_at: new Date("2023-10-20"),
    voters: [],
  },
  "6": {
    id: "6",
    title: "Tamil Nadu Local Body Election",
    purpose: "Election of Panchayat members",
    start_date: new Date("2023-08-10"),
    end_date: new Date("2023-08-20"),
    state: "Tamil Nadu",
    district: "Chennai",
    status: 2, // Completed
    total_votes: 6300,
    constituency_id: "c6",
    constituency_name: "Chennai North",
    created_at: new Date("2023-07-15"),
    updated_at: new Date("2023-08-21"),
    voters: ["0x1234567890123456789012345678901234567890"],
  },
};

const SAMPLE_CANDIDATES: Record<string, Candidate[]> = {
  "1": [
    {
      id: "c1",
      name: "Rajesh Kumar",
      party: "National Democratic Party",
      image: "/placeholder.svg?height=100&width=100",
      description:
        "Former Minister with 15 years of experience in public service. Focused on infrastructure development and education reforms.",
      election_id: "1",
      votes: 5200,
    },
    {
      id: "c2",
      name: "Priya Singh",
      party: "Progressive Alliance",
      image: "/placeholder.svg?height=100&width=100",
      description:
        "Social activist and economist. Advocates for women's rights, environmental protection, and sustainable economic policies.",
      election_id: "1",
      votes: 4800,
    },
    {
      id: "c3",
      name: "Amit Sharma",
      party: "People's Front",
      image: "/placeholder.svg?height=100&width=100",
      description:
        "Businessman and first-time candidate. Promises to bring administrative efficiency and technological innovation to governance.",
      election_id: "1",
      votes: 2500,
    },
  ],
  "2": [
    {
      id: "c4",
      name: "Suresh Patel",
      party: "Maharashtra Development Front",
      image: "/placeholder.svg?height=100&width=100",
      description:
        "Local businessman with strong community ties. Focused on urban development and job creation.",
      election_id: "2",
      votes: 0,
    },
    {
      id: "c5",
      name: "Meena Desai",
      party: "Progressive Democratic Alliance",
      image: "/placeholder.svg?height=100&width=100",
      description:
        "Former municipal corporator. Advocates for better healthcare and education facilities in the constituency.",
      election_id: "2",
      votes: 0,
    },
  ],
  "3": [
    {
      id: "c6",
      name: "Ramesh Rao",
      party: "People's Democratic Front",
      image: "/placeholder.svg?height=100&width=100",
      description:
        "IT professional turned politician. Focused on smart city initiatives and digital governance.",
      election_id: "3",
      votes: 3200,
    },
    {
      id: "c7",
      name: "Lakshmi Devi",
      party: "Municipal Workers Party",
      image: "/placeholder.svg?height=100&width=100",
      description:
        "Former municipal employee with grassroots experience. Advocates for better civic amenities and waste management.",
      election_id: "3",
      votes: 2800,
    },
    {
      id: "c8",
      name: "Venkat Reddy",
      party: "Urban Development Alliance",
      image: "/placeholder.svg?height=100&width=100",
      description:
        "Architect and urban planner. Promises to improve city infrastructure and public spaces.",
      election_id: "3",
      votes: 2750,
    },
  ],
  "4": [
    {
      id: "c9",
      name: "Neha Gupta",
      party: "Citizen's Coalition",
      image: "/placeholder.svg?height=100&width=100",
      description:
        "Community organizer and social worker. Focused on inclusive development and citizen participation.",
      election_id: "4",
      votes: 2100,
    },
    {
      id: "c10",
      name: "Vikram Patel",
      party: "Urban Development Alliance",
      image: "/placeholder.svg?height=100&width=100",
      description:
        "Civil engineer with expertise in urban planning. Advocates for sustainable infrastructure and green spaces.",
      election_id: "4",
      votes: 1800,
    },
    {
      id: "c11",
      name: "Sunita Verma",
      party: "Municipal Reform Party",
      image: "/placeholder.svg?height=100&width=100",
      description:
        "Former teacher and education activist. Promises to improve municipal schools and healthcare facilities.",
      election_id: "4",
      votes: 1300,
    },
  ],
  "5": [
    {
      id: "c12",
      name: "Aditya Singh",
      party: "Uttar Pradesh People's Party",
      image: "/placeholder.svg?height=100&width=100",
      description:
        "Young leader with a background in law. Focused on legal reforms and youth empowerment.",
      election_id: "5",
      votes: 0,
    },
    {
      id: "c13",
      name: "Rekha Yadav",
      party: "Progressive Democratic Front",
      image: "/placeholder.svg?height=100&width=100",
      description:
        "Experienced politician with a strong focus on rural development and farmer welfare.",
      election_id: "5",
      votes: 0,
    },
  ],
  "6": [
    {
      id: "c14",
      name: "Meena Kumari",
      party: "Rural Development Front",
      image: "/placeholder.svg?height=100&width=100",
      description:
        "Grassroots leader with experience in panchayat administration. Focused on rural infrastructure and water management.",
      election_id: "6",
      votes: 2500,
    },
    {
      id: "c15",
      name: "Senthil Kumar",
      party: "People's Welfare Party",
      image: "/placeholder.svg?height=100&width=100",
      description:
        "Former government official with expertise in rural development schemes. Advocates for transparent governance.",
      election_id: "6",
      votes: 2300,
    },
    {
      id: "c16",
      name: "Anitha Rajan",
      party: "Progressive Alliance",
      image: "/placeholder.svg?height=100&width=100",
      description:
        "Social activist focused on women's empowerment and education in rural areas.",
      election_id: "6",
      votes: 1500,
    },
  ],
};

export default function ElectionDetailPage() {
  const { walletAddress, isProfileComplete } = useWallet();
  const navigate = useNavigate();
  const location = useLocation();
  //   const { toast } = useToast()
  const [selectedCandidate, setSelectedCandidate] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [election, setElection] = useState<Election | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [activeTab, setActiveTab] = useState("details");
  const electionId = location.pathname.split("/").pop() || "";

  useEffect(() => {
    if (!walletAddress) {
      navigate("/");
      return;
    }

    if (!isProfileComplete) {
      navigate("/update-profile");
      return;
    }

    const electionData = SAMPLE_ELECTIONS[electionId];
    if (!electionData) {
      navigate("/vote");
      return;
    }

    // Check if user has already voted
    if (electionData.voters?.includes(walletAddress)) {
      setHasVoted(true);
    }

    setElection(electionData);
    setCandidates(SAMPLE_CANDIDATES[electionId] || []);
  }, [walletAddress, isProfileComplete, electionId, navigate, toast]);

  const handleVote = async () => {
    if (!selectedCandidate) {
      //   toast({
      //     title: "No Candidate Selected",
      //     description: "Please select a candidate to vote for.",
      //     variant: "destructive",
      //   })
      return;
    }

    setIsSubmitting(true);

    // Simulate API call to record vote
    setTimeout(() => {
      // Update local state to reflect vote
      if (election) {
        election.voters = [...(election.voters || []), walletAddress || ""];
        election.total_votes += 1;
      }

      setIsSubmitting(false);
      setHasVoted(true);

      //   toast({
      //     title: "Vote Recorded",
      //     description: "Your vote has been successfully recorded on the blockchain.",
      //   })

      // Redirect to confirmation or home after a short delay
      setTimeout(() => {
        navigate("/vote");
      }, 2000);
    }, 3000);
  };

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

  // Helper function to find the winner candidate
  const getWinnerCandidate = (candidates: Candidate[]) => {
    if (!candidates.length) return null;
    return candidates.reduce((prev, current) =>
      prev.votes > current.votes ? prev : current
    );
  };

  if (!election) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center">
        <Loader size="lg" text="Loading election details..." />
      </div>
    );
  }

  const winner = election.status === 2 ? getWinnerCandidate(candidates) : null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Link
          to="/vote"
          className="inline-flex items-center text-primary hover:underline"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Elections
        </Link>
      </div>

      <Card className="mb-8">
        <CardHeader className="bg-primary/5 border-b border-border">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{election.title}</CardTitle>
              <CardDescription className="mt-1">
                {election.purpose}
              </CardDescription>
            </div>
            <div>{renderStatusBadge(election.status)}</div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{candidates.length} Candidates</span>
              </div>
            </div>
            <div className="space-y-3">
              {election.status === 1 && (
                <div className="text-sm">
                  <span className="font-medium">{election.total_votes}</span>{" "}
                  votes cast so far
                </div>
              )}
              {election.status === 2 && (
                <div className="text-sm">
                  <span className="font-medium">{election.total_votes}</span>{" "}
                  total votes
                </div>
              )}
              {election.status === 2 && winner && (
                <div className="flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-md">
                  <Crown className="h-5 w-5 mr-2" />
                  <div>
                    <p className="font-medium">Winner: {winner.name}</p>
                    <p className="text-sm">
                      {winner.party} - {winner.votes} votes
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="details">Election Details</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          {election.status === 2 && (
            <TabsTrigger value="results">Results</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>About This Election</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Purpose</h3>
                  <p className="text-muted-foreground">{election.purpose}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Eligibility</h3>
                  <p className="text-muted-foreground">
                    All registered voters in the {election.constituency_name}{" "}
                    constituency of {election.district}, {election.state} are
                    eligible to vote in this election.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Voting Period</h3>
                  <p className="text-muted-foreground">
                    Voting begins on{" "}
                    {format(election.start_date, "MMMM d, yyyy")} and ends on{" "}
                    {format(election.end_date, "MMMM d, yyyy")}.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Verification</h3>
                  <p className="text-muted-foreground">
                    All votes are recorded on the blockchain for transparency
                    and verification. Each voter can cast only one vote, and the
                    voting process is secured using blockchain technology.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="candidates" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((candidate) => (
              <Card
                key={candidate.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4">
                      <img
                        src={candidate.image || "/placeholder.svg"}
                        alt={candidate.name}
                        className="w-24 h-24 rounded-full object-cover border"
                      />
                    </div>
                    <h3 className="text-lg font-medium">{candidate.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {candidate.party}
                    </p>
                    {candidate.description && (
                      <p className="text-sm text-muted-foreground">
                        {candidate.description}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {election.status === 2 && (
          <TabsContent value="results" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Election Results</CardTitle>
                <CardDescription>
                  Final vote counts for all candidates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {candidates
                    .sort((a, b) => b.votes - a.votes)
                    .map((candidate) => {
                      const isWinner = winner?.id === candidate.id;
                      const percentage =
                        Math.round(
                          (candidate.votes / election.total_votes) * 100
                        ) || 0;

                      return (
                        <div key={candidate.id} className="relative">
                          <div className="flex items-center mb-2">
                            <div className="flex items-center flex-1">
                              <div className="relative mr-4">
                                <img
                                  src={candidate.image || "/placeholder.svg"}
                                  alt={candidate.name}
                                  className="w-10 h-10 rounded-full object-cover border"
                                />
                                {isWinner && (
                                  <div className="absolute -top-1 -right-1 bg-green-500 text-white p-0.5 rounded-full">
                                    <Crown className="h-3 w-3" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-medium">
                                  {candidate.name}{" "}
                                  {isWinner && (
                                    <span className="text-green-600">
                                      (Winner)
                                    </span>
                                  )}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {candidate.party}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {candidate.votes} votes
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {percentage}% of total
                              </p>
                            </div>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${
                                isWinner ? "bg-green-500" : "bg-primary/60"
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {election.status === 1 && (
        <div className="mt-8">
          {hasVoted ? (
            <Card className="text-center p-8">
              <CardContent>
                <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Vote Already Cast</h2>
                <p className="text-muted-foreground mb-6">
                  You have already voted in this election. Your vote has been
                  recorded on the blockchain.
                </p>
                <Button onClick={() => navigate("/vote")}>
                  Return to Elections
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6">Cast Your Vote</h2>

              <div className="mb-8">
                <RadioGroup
                  value={selectedCandidate}
                  onValueChange={setSelectedCandidate}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {candidates.map((candidate) => (
                      <Card
                        key={candidate.id}
                        className={`hover:shadow-md transition-shadow cursor-pointer ${
                          selectedCandidate === candidate.id
                            ? "ring-2 ring-primary"
                            : ""
                        }`}
                        onClick={() => setSelectedCandidate(candidate.id)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <RadioGroupItem
                              value={candidate.id}
                              id={candidate.id}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-4">
                                <img
                                  src={candidate.image || "/placeholder.svg"}
                                  alt={candidate.name}
                                  className="w-16 h-16 rounded-full object-cover border"
                                />
                                <div>
                                  <Label
                                    htmlFor={candidate.id}
                                    className="text-lg font-medium cursor-pointer"
                                  >
                                    {candidate.name}
                                  </Label>
                                  <p className="text-sm text-muted-foreground">
                                    {candidate.party}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={handleVote}
                  disabled={!selectedCandidate || isSubmitting}
                  className="px-8"
                >
                  {isSubmitting ? (
                    <>
                      <Loader size="sm" className="mr-2" /> Recording Vote...
                    </>
                  ) : (
                    <>
                      <VoteIcon className="h-5 w-5 mr-2" /> Cast Your Vote
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
