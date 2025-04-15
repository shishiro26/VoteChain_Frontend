"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {toast} from "sonner"
import { Calendar, CheckCircle, Crown, MapPin, Medal, Search } from "lucide-react"
import { format } from "date-fns"

// Election model type
interface Election {
  id: string
  title: string
  purpose: string
  start_date: Date
  end_date: Date
  state: string
  status: number // 0 = Upcoming, 1 = Ongoing, 2 = Completed
  total_votes: number
  constituency_id: string
  constituency_name: string
  created_at: Date
  updated_at: Date
  result_declared: boolean
}

// Candidate model type
interface Candidate {
  id: string
  name: string
  party: string
  image: string
  election_id: string
  votes: number
}

// Sample completed elections
const COMPLETED_ELECTIONS: Election[] = [
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
    created_at: new Date("2023-08-01"),
    updated_at: new Date("2023-09-16"),
    result_declared: false,
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
    created_at: new Date("2023-07-15"),
    updated_at: new Date("2023-08-21"),
    result_declared: true,
  },
]

// Sample candidates data
const CANDIDATES_BY_ELECTION: Record<string, Candidate[]> = {
  "3": [
    {
      id: "c7",
      name: "Ramesh Rao",
      party: "People's Democratic Front",
      image: "/placeholder.svg?height=100&width=100",
      election_id: "3",
      votes: 3200,
    },
    {
      id: "c8",
      name: "Lakshmi Devi",
      party: "Municipal Workers Party",
      image: "/placeholder.svg?height=100&width=100",
      election_id: "3",
      votes: 2800,
    },
    {
      id: "c9",
      name: "Venkat Reddy",
      party: "Urban Development Alliance",
      image: "/placeholder.svg?height=100&width=100",
      election_id: "3",
      votes: 2750,
    },
  ],
  "6": [
    {
      id: "c10",
      name: "Meena Kumari",
      party: "Rural Development Front",
      image: "/placeholder.svg?height=100&width=100",
      election_id: "6",
      votes: 2500,
    },
    {
      id: "c11",
      name: "Senthil Kumar",
      party: "People's Welfare Party",
      image: "/placeholder.svg?height=100&width=100",
      election_id: "6",
      votes: 2300,
    },
    {
      id: "c12",
      name: "Anitha Rajan",
      party: "Progressive Alliance",
      image: "/placeholder.svg?height=100&width=100",
      election_id: "6",
      votes: 1500,
    },
  ],
}

export default function DeclareResultsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedElection, setSelectedElection] = useState<Election | null>(null)
  const [declareDialogOpen, setDeclareDialogOpen] = useState(false)
//   const { toast } = useToast()

  // Filter elections based on search term
  const filteredElections = COMPLETED_ELECTIONS.filter(
    (election) =>
      election.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      election.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      election.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      election.constituency_name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeclareResult = (election: Election) => {
    setSelectedElection(election)
    setDeclareDialogOpen(true)
  }

  const confirmDeclareResult = () => {
    if (!selectedElection) return

    // Simulate API call to declare result
    // toast({
    //   title: "Result Declared",
    //   description: `Results for ${selectedElection.title} have been officially declared.`,
    // })
    setDeclareDialogOpen(false)
  }

  // Helper function to find the winner candidate
  const getWinnerCandidate = (candidates: Candidate[]) => {
    if (!candidates.length) return null
    return candidates.reduce((prev, current) => (prev.votes > current.votes ? prev : current))
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Declare Results</h1>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search completed elections..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredElections.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">No completed elections found.</CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {filteredElections.map((election) => {
            const candidates = CANDIDATES_BY_ELECTION[election.id] || []
            const winner = getWinnerCandidate(candidates)

            return (
              <Card key={election.id} className="overflow-hidden">
                <CardHeader className="bg-primary/5 border-b border-border">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{election.title}</CardTitle>
                      <CardDescription className="mt-1">{election.purpose}</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            {format(election.start_date, "MMM d, yyyy")} - {format(election.end_date, "MMM d, yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            {election.state}, {election.constituency_name}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">{election.total_votes}</span> total votes cast
                        </div>
                      </div>

                      <div>
                        {election.result_declared ? (
                          <div className="flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-md">
                            <Crown className="h-5 w-5 mr-2" />
                            <div>
                              <p className="font-medium">Results Declared</p>
                              <p className="text-sm">
                                Winner: {winner?.name} ({winner?.party})
                              </p>
                            </div>
                          </div>
                        ) : (
                          <Button onClick={() => handleDeclareResult(election)}>
                            <Medal className="h-4 w-4 mr-2" /> Declare Result
                          </Button>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Candidates & Vote Count</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {candidates.map((candidate) => {
                          const isWinner = winner?.id === candidate.id
                          return (
                            <Card
                              key={candidate.id}
                              className={`hover:shadow-md transition-shadow ${
                                isWinner ? "border-green-500 bg-green-50" : ""
                              }`}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center space-x-4">
                                  <div className="relative">
                                    <img
                                      src={candidate.image || "/placeholder.svg"}
                                      alt={candidate.name}
                                      className="w-16 h-16 rounded-full object-cover border"
                                    />
                                    {isWinner && (
                                      <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full">
                                        <Crown className="h-4 w-4" />
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{candidate.name}</h4>
                                    <p className="text-sm text-muted-foreground">{candidate.party}</p>
                                    <div className="mt-1 flex items-center">
                                      <Badge
                                        variant="outline"
                                        className={`${
                                          isWinner
                                            ? "bg-green-100 text-green-800 border-green-200"
                                            : "bg-muted text-muted-foreground"
                                        }`}
                                      >
                                        {candidate.votes} votes
                                      </Badge>
                                      {isWinner && (
                                        <span className="ml-2 text-xs text-green-600 font-medium">Winner</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
                {!election.result_declared && (
                  <CardFooter className="border-t border-border pt-4 bg-muted/30">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Note:</span> Declaring results is final and cannot be undone. The
                      results will be published on the blockchain for transparency.
                    </p>
                  </CardFooter>
                )}
              </Card>
            )
          })}
        </div>
      )}

      {/* Declare Result Dialog */}
      <AlertDialog open={declareDialogOpen} onOpenChange={setDeclareDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Declare Election Results</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to declare the results for {selectedElection?.title}? This action is final and will
              be recorded on the blockchain.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeclareResult} className="bg-primary hover:bg-primary/90">
              <Medal className="h-4 w-4 mr-2" /> Declare Results
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
