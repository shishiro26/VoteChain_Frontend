import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  CheckCircle,
  Search,
  Shield,
  ThumbsDown,
  ThumbsUp,
  User,
  X,
} from "lucide-react";

const PENDING_USERS = [
  {
    id: "1",
    firstName: "Rahul",
    lastName: "Sharma",
    email: "rahul.sharma@example.com",
    phone: "9876543210",
    walletAddress: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
    state: "Maharashtra",
    district: "Mumbai City",
    constituency: "Worli",
    status: "pending",
    createdAt: "2023-11-01T10:30:00Z",
  },
  {
    id: "2",
    firstName: "Priya",
    lastName: "Patel",
    email: "priya.patel@example.com",
    phone: "8765432109",
    walletAddress: "0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u",
    state: "Delhi",
    district: "South Delhi",
    constituency: "Greater Kailash",
    status: "pending",
    createdAt: "2023-11-02T09:15:00Z",
  },
  {
    id: "3",
    firstName: "Vikram",
    lastName: "Singh",
    email: "vikram.singh@example.com",
    phone: "7654321098",
    walletAddress: "0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2vw",
    state: "Karnataka",
    district: "Bengaluru",
    constituency: "Jayanagar",
    status: "pending",
    createdAt: "2023-11-03T14:45:00Z",
  },
  {
    id: "4",
    firstName: "Ananya",
    lastName: "Gupta",
    email: "ananya.gupta@example.com",
    phone: "6543210987",
    walletAddress: "0x4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w",
    state: "Tamil Nadu",
    district: "Chennai",
    constituency: "T. Nagar",
    status: "pending",
    createdAt: "2023-11-04T11:20:00Z",
  },
  {
    id: "5",
    firstName: "Arjun",
    lastName: "Kumar",
    email: "arjun.kumar@example.com",
    phone: "5432109876",
    walletAddress: "0x5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x",
    state: "Uttar Pradesh",
    district: "Lucknow",
    constituency: "Hazratganj",
    status: "pending",
    createdAt: "2023-11-05T16:10:00Z",
  },
];

const APPROVED_USERS = [
  {
    id: "6",
    firstName: "Neha",
    lastName: "Verma",
    email: "neha.verma@example.com",
    phone: "4321098765",
    walletAddress: "0x6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y",
    state: "Gujarat",
    district: "Ahmedabad",
    constituency: "Navrangpura",
    status: "approved",
    createdAt: "2023-10-28T13:25:00Z",
    approvedAt: "2023-10-29T10:15:00Z",
  },
  {
    id: "7",
    firstName: "Suresh",
    lastName: "Reddy",
    email: "suresh.reddy@example.com",
    phone: "3210987654",
    walletAddress: "0x7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
    state: "Telangana",
    district: "Hyderabad",
    constituency: "Banjara Hills",
    status: "approved",
    createdAt: "2023-10-29T09:40:00Z",
    approvedAt: "2023-10-30T11:30:00Z",
  },
];

const REJECTED_USERS = [
  {
    id: "8",
    firstName: "Kiran",
    lastName: "Joshi",
    email: "kiran.joshi@example.com",
    phone: "2109876543",
    walletAddress: "0x8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a",
    state: "Rajasthan",
    district: "Jaipur",
    constituency: "Civil Lines",
    status: "rejected",
    createdAt: "2023-10-30T15:50:00Z",
    rejectedAt: "2023-10-31T09:20:00Z",
    rejectionReason: "Information mismatch with Aadhaar records",
  },
];

export default function ApproveUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<unknown>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");

  // Filter users based on search term
  const filteredPendingUsers = PENDING_USERS.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.walletAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredApprovedUsers = APPROVED_USERS.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.walletAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRejectedUsers = REJECTED_USERS.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.walletAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = (user: unknown) => {
    setSelectedUser(user);
    setApproveDialogOpen(true);
  };

  const handleReject = (user: unknown) => {
    setSelectedUser(user);
    setRejectDialogOpen(true);
  };

  const confirmApprove = () => {
    // Simulate API call to approve user
    // toast({
    //   title: "User Approved",
    //   description: `${selectedUser.firstName} ${selectedUser.lastName} has been approved for voting.`,
    // });
    setApproveDialogOpen(false);
  };

  const confirmReject = () => {
    // Simulate API call to reject user
    // toast({
    //   title: "User Rejected",
    //   description: `${selectedUser.firstName} ${selectedUser.lastName} has been rejected.`,
    //   variant: "destructive",
    // });
    setRejectDialogOpen(false);
  };

  return (
    <div>
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search users by name, email, or wallet address..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="pending" className="relative">
            Pending
            <Badge className="ml-2 bg-amber-500 hover:bg-amber-500">
              {filteredPendingUsers.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved
            <Badge className="ml-2 bg-green-500 hover:bg-green-500">
              {filteredApprovedUsers.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected
            <Badge className="ml-2 bg-red-500 hover:bg-red-500">
              {filteredRejectedUsers.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {filteredPendingUsers.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No pending users found.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredPendingUsers.map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {user.firstName} {user.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                          <div className="flex items-center mt-1">
                            <Badge
                              variant="outline"
                              className="text-xs bg-amber-100 text-amber-800 border-amber-200"
                            >
                              Pending Verification
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mt-4 md:mt-0">
                        <div>
                          <p className="text-muted-foreground">
                            Wallet Address
                          </p>
                          <p className="font-mono text-xs truncate max-w-[150px]">
                            {user.walletAddress}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Phone</p>
                          <p>{user.phone}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Location</p>
                          <p>
                            {user.constituency}, {user.district}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4 md:mt-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-500 text-green-600 hover:bg-green-50"
                          onClick={() => handleApprove(user)}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" /> Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-500 text-red-600 hover:bg-red-50"
                          onClick={() => handleReject(user)}
                        >
                          <ThumbsDown className="h-4 w-4 mr-1" /> Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved">
          {filteredApprovedUsers.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No approved users found.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredApprovedUsers.map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-green-100 p-3 rounded-full">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {user.firstName} {user.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                          <div className="flex items-center mt-1">
                            <Badge
                              variant="outline"
                              className="text-xs bg-green-100 text-green-800 border-green-200"
                            >
                              Approved
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mt-4 md:mt-0">
                        <div>
                          <p className="text-muted-foreground">
                            Wallet Address
                          </p>
                          <p className="font-mono text-xs truncate max-w-[150px]">
                            {user.walletAddress}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Phone</p>
                          <p>{user.phone}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Location</p>
                          <p>
                            {user.constituency}, {user.district}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected">
          {filteredRejectedUsers.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No rejected users found.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredRejectedUsers.map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-red-100 p-3 rounded-full">
                          <X className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {user.firstName} {user.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                          <div className="flex items-center mt-1">
                            <Badge
                              variant="outline"
                              className="text-xs bg-red-100 text-red-800 border-red-200"
                            >
                              Rejected
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mt-4 md:mt-0">
                        <div>
                          <p className="text-muted-foreground">
                            Wallet Address
                          </p>
                          <p className="font-mono text-xs truncate max-w-[150px]">
                            {user.walletAddress}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Reason</p>
                          <p className="text-red-600">{user.rejectionReason}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Rejected On</p>
                          <p>
                            {new Date(user.rejectedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Approve Dialog */}
      <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve {selectedUser?.firstName}{" "}
              {selectedUser?.lastName}? This will allow them to participate in
              elections.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmApprove}
              className="bg-green-600 hover:bg-green-700"
            >
              <Shield className="h-4 w-4 mr-2" /> Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject {selectedUser?.firstName}{" "}
              {selectedUser?.lastName}? They will not be able to participate in
              elections.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmReject}
              className="bg-red-600 hover:bg-red-700"
            >
              <X className="h-4 w-4 mr-2" /> Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
