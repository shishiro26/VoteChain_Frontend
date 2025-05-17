import { useState, useEffect } from "react";
import { Search, User, Check, X, Shield, Flag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Loader } from "../loaders/loader";

interface UserType {
  id: string;
  name: string;
  walletAddress: string;
  aadhaarNumber: string;
  profileImage?: string;
  status: "pending" | "approved" | "rejected";
  party?: {
    id: string;
    name: string;
    symbol: string;
    status: "pending" | "verified" | "rejected";
  };
  role?: "member" | "leader" | "admin";
  constituency?: string;
  votingHistory?: {
    electionId: string;
    electionName: string;
    votedAt: Date;
  }[];
}

// Sample users data
const SAMPLE_USERS: UserType[] = [
  {
    id: "u1",
    name: "Rahul Sharma",
    walletAddress: "0x1234...5678",
    aadhaarNumber: "XXXX-XXXX-1234",
    profileImage: "/placeholder.svg?height=40&width=40",
    status: "approved",
    party: {
      id: "p1",
      name: "National Democratic Party",
      symbol: "🦁",
      status: "verified",
    },
    role: "member",
    constituency: "Mumbai South",
    votingHistory: [
      {
        electionId: "e1",
        electionName: "Maharashtra State Assembly Election 2023",
        votedAt: new Date("2023-05-15"),
      },
    ],
  },
  {
    id: "u2",
    name: "Priya Patel",
    walletAddress: "0x2345...6789",
    aadhaarNumber: "XXXX-XXXX-2345",
    profileImage: "/placeholder.svg?height=40&width=40",
    status: "approved",
    party: {
      id: "p2",
      name: "Progressive Alliance",
      symbol: "🐘",
      status: "verified",
    },
    role: "leader",
    constituency: "Delhi East",
    votingHistory: [
      {
        electionId: "e2",
        electionName: "Delhi Municipal Election 2023",
        votedAt: new Date("2023-06-20"),
      },
    ],
  },
  {
    id: "u3",
    name: "Amit Kumar",
    walletAddress: "0x3456...7890",
    aadhaarNumber: "XXXX-XXXX-3456",
    status: "pending",
    constituency: "Bangalore Central",
  },
  {
    id: "u4",
    name: "Sneha Gupta",
    walletAddress: "0x4567...8901",
    aadhaarNumber: "XXXX-XXXX-4567",
    profileImage: "/placeholder.svg?height=40&width=40",
    status: "approved",
    constituency: "Chennai North",
    votingHistory: [
      {
        electionId: "e3",
        electionName: "Tamil Nadu Local Body Election 2023",
        votedAt: new Date("2023-07-10"),
      },
    ],
  },
  {
    id: "u5",
    name: "Vikram Singh",
    walletAddress: "0x5678...9012",
    aadhaarNumber: "XXXX-XXXX-5678",
    profileImage: "/placeholder.svg?height=40&width=40",
    status: "rejected",
    constituency: "Jaipur Rural",
  },
];

interface UserSearchProps {
  onUserSelect?: (user: UserType) => void;
  showApproveReject?: boolean;
  showPartyInfo?: boolean;
  showVotingHistory?: boolean;
  initialFilter?: "all" | "pending" | "approved" | "rejected";
  itemsPerPage?: number;
}

export function UserSearch({
  onUserSelect,
  showApproveReject = false,
  showPartyInfo = true,
  showVotingHistory = true,
  initialFilter = "all",
  itemsPerPage = 5,
}: UserSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers([]);
      return;
    }

    setIsLoading(true);

    const timer = setTimeout(() => {
      const term = searchTerm.toLowerCase();
      const filtered = SAMPLE_USERS.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.walletAddress.toLowerCase().includes(term) ||
          (user.aadhaarNumber &&
            user.aadhaarNumber.toLowerCase().includes(term)) ||
          (user.constituency && user.constituency.toLowerCase().includes(term))
      );
      setFilteredUsers(filtered);
      setTotalPages(Math.ceil(filtered.length / itemsPerPage));
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, itemsPerPage]);

  // Load users based on initialFilter when component mounts
  useEffect(() => {
    if (initialFilter !== "all") {
      setIsLoading(true);

      // Simulate API call delay
      const timer = setTimeout(() => {
        const filtered = SAMPLE_USERS.filter(
          (user) => user.status === initialFilter
        );
        setFilteredUsers(filtered);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        setIsLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [initialFilter, itemsPerPage]);

  const handleApprove = async (userId: string) => {
    setProcessingUserId(userId);

    // Simulate API call
    setTimeout(() => {
      // Update the user status in the filtered list
      setFilteredUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, status: "approved" } : user
        )
      );
      setProcessingUserId(null);
    }, 1000);
  };

  const handleReject = async (userId: string) => {
    setProcessingUserId(userId);

    // Simulate API call
    setTimeout(() => {
      // Update the user status in the filtered list
      setFilteredUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, status: "rejected" } : user
        )
      );
      setProcessingUserId(null);
    }, 1000);
  };

  const handleUserSelect = (user: UserType) => {
    setSelectedUser(user);
    if (onUserSelect) {
      onUserSelect(user);
    }
    setShowUserDetails(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPaginatedUsers = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Approved
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Rejected
          </Badge>
        );
      case "verified":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Verified
          </Badge>
        );
      default:
        return null;
    }
  };

  const getRoleBadge = (role?: string) => {
    if (!role) return null;

    switch (role) {
      case "leader":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 ml-2"
                >
                  <Flag className="h-3 w-3 mr-1" />
                  Leader
                </Badge>
              </TooltipTrigger>
              <TooltipContent>Party Leader</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case "admin":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-purple-700 border-purple-200 ml-2"
                >
                  <Shield className="h-3 w-3 mr-1" />
                  Admin
                </Badge>
              </TooltipTrigger>
              <TooltipContent>System Administrator</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, wallet address, Aadhaar, or constituency..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading && (
        <div className="flex justify-center p-4">
          <Loader size="md" />
        </div>
      )}

      {!isLoading && searchTerm.trim() !== "" && filteredUsers.length === 0 && (
        <div className="text-center p-4 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">
            No users found matching "{searchTerm}"
          </p>
        </div>
      )}

      {!isLoading && filteredUsers.length > 0 && (
        <div className="space-y-3">
          {getPaginatedUsers().map((user) => (
            <Card
              key={user.id}
              className={cn(
                "hover:bg-muted/20 transition-colors cursor-pointer",
                selectedUser?.id === user.id && "ring-2 ring-primary/20"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div
                    className="flex items-start space-x-4"
                    onClick={() => handleUserSelect(user)}
                  >
                    <Avatar className="h-10 w-10 mt-1">
                      {user.profileImage ? (
                        <AvatarImage
                          src={user.profileImage || "/placeholder.svg"}
                          alt={user.name}
                        />
                      ) : (
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium">{user.name}</h3>
                        {getRoleBadge(user.role)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {user.walletAddress}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-2">
                        {getStatusBadge(user.status)}

                        {user.constituency && (
                          <Badge variant="outline" className="bg-muted">
                            {user.constituency}
                          </Badge>
                        )}
                      </div>

                      {showPartyInfo && user.party && (
                        <div className="mt-2 flex items-center">
                          <span className="text-lg mr-1">
                            {user.party.symbol}
                          </span>
                          <span className="text-sm">{user.party.name}</span>
                          {getStatusBadge(user.party.status)}
                        </div>
                      )}
                    </div>
                  </div>

                  {showApproveReject && user.status === "pending" && (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                        onClick={() => handleApprove(user.id)}
                        disabled={processingUserId === user.id}
                      >
                        {processingUserId === user.id ? (
                          <Loader size="sm" className="mr-1" />
                        ) : (
                          <Check className="h-4 w-4 mr-1" />
                        )}
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                        onClick={() => handleReject(user.id)}
                        disabled={processingUserId === user.id}
                      >
                        {processingUserId === user.id ? (
                          <Loader size="sm" className="mr-1" />
                        ) : (
                          <X className="h-4 w-4 mr-1" />
                        )}
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && filteredUsers.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of{" "}
            {filteredUsers.length} users
          </p>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* User Details Dialog */}
      {selectedUser && (
        <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>
                Complete information about the selected user
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  {selectedUser.profileImage ? (
                    <AvatarImage
                      src={selectedUser.profileImage || "/placeholder.svg"}
                      alt={selectedUser.name}
                    />
                  ) : (
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <div className="flex items-center">
                    <h2 className="text-xl font-semibold">
                      {selectedUser.name}
                    </h2>
                    {getRoleBadge(selectedUser.role)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedUser.walletAddress}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  <div className="mt-1">
                    {getStatusBadge(selectedUser.status)}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Aadhaar
                  </p>
                  <p className="mt-1">{selectedUser.aadhaarNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Constituency
                  </p>
                  <p className="mt-1">
                    {selectedUser.constituency || "Not assigned"}
                  </p>
                </div>
              </div>

              {showPartyInfo && (
                <div className="pt-2">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Party Affiliation
                  </p>
                  {selectedUser.party ? (
                    <div className="flex items-center space-x-2 p-3 bg-muted/20 rounded-md">
                      <span className="text-2xl">
                        {selectedUser.party.symbol}
                      </span>
                      <div>
                        <p className="font-medium">{selectedUser.party.name}</p>
                        <div className="mt-1">
                          {getStatusBadge(selectedUser.party.status)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No party affiliation
                    </p>
                  )}
                </div>
              )}

              {showVotingHistory && (
                <div className="pt-2">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Voting History
                  </p>
                  {selectedUser.votingHistory &&
                  selectedUser.votingHistory.length > 0 ? (
                    <div className="space-y-2">
                      {selectedUser.votingHistory.map((vote, index) => (
                        <div key={index} className="p-3 bg-muted/20 rounded-md">
                          <p className="font-medium">{vote.electionName}</p>
                          <p className="text-sm text-muted-foreground">
                            Voted on {vote.votedAt.toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No voting history</p>
                  )}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button onClick={() => setShowUserDetails(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
