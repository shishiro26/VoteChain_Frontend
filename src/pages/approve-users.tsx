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
  Search,
  User,
  ThumbsDown,
  ThumbsUp,
  Shield,
  X,
  Eye,
} from "lucide-react";
import {
  useApproveUserMutation,
  usePendingUsers,
  useRejectUserMutation,
} from "@/hooks/use-admin";
import { Loader } from "@/components/ui/loader";
import { useSearchParams } from "react-router";
import { Dialog, DialogTitle, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useGenericMutation } from "@/hooks/useGenericMutation";
import { toast } from "sonner";

type Location = {
  state_name: string;
  district_name: string;
  mandal_name: string;
  constituency_name: string;
};

type User = {
  id: string;
  wallet_address: string;
  status: "pending" | "approved" | "rejected";
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  profile_image: string;
  location: Location[];
};

const types = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

export default function ApproveUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User>({} as User);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [viewImageDialogOpen, setViewImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
  } | null>(null);
  const [rejectedReason, setRejectedReason] = useState<string>("");
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get("status") || "pending";
  const page = searchParams.get("page") || "1";

  const { data: users, isLoading } = usePendingUsers({
    page: Number(page),
    limit: 10,
    filter: { status: status.toUpperCase() },
    sortBy: "created_at:desc",
    populate: "UserDetails,UserLocation",
  });

  const approve_user = useApproveUserMutation();
  const reject_user = useRejectUserMutation();

  const filterUsers = (users: User[]) => {
    return users.filter(
      (user) =>
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.wallet_address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredUsers =
    !isLoading && users.length > 0 ? filterUsers(users) : [];

  const handleApprove = (user: User) => {
    setSelectedUser(user);
    setApproveDialogOpen(true);
  };

  const handleReject = (user: User) => {
    setSelectedUser(user);
    setRejectDialogOpen(true);
  };

  const confirmApprove = () => {
    approve_user.mutate(
      {
        userId: selectedUser.id,
      },
      {
        onSuccess: () => {
          setTimeout(() => {
            setApproveDialogOpen(false);
          }, 10000);
        },
        onError: (error) => {
          console.error("error", error);
          toast.error("Error while approving user");
        },
      }
    );
  };

  const confirmReject = () => {
    console.log("I am in this");
    reject_user.mutate(
      {
        userId: selectedUser.id,
        reason: rejectedReason,
      },
      {
        onSuccess: () => {
          toast.success("User rejected successfully");
          setTimeout(() => {
            setRejectDialogOpen(false);
          }, 10000);
        },
        onError: (error) => {
          console.error("error", error);
          toast.error("Error while rejecting user");
        },
      }
    );
  };

  const handleTabChange = (newTab: string) => {
    setSearchParams({ status: newTab, page: "1" });
  };

  const viewImage = (url: string, title: string) => {
    setSelectedImage({ url, title });
    setViewImageDialogOpen(true);
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

      <Tabs value={status} onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          {Object.entries(types).map(([key, value]) => (
            <TabsTrigger key={key} value={key} className="relative">
              {value}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(types).map(([key, value]) => (
          <TabsContent key={key} value={key}>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader
                  text={`Hang tight! We're gathering the latest list of ${value} users...`}
                  size="lg"
                />
              </div>
            ) : filteredUsers.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No {value} users found.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <Card key={user.wallet_address}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="relative h-16 w-16 rounded-full overflow-hidden border">
                            <img
                              src={user.profile_image}
                              alt={`${user.first_name} ${user.last_name}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity rounded-full hover:cursor-pointer"
                              onClick={() =>
                                viewImage(
                                  user.profile_image,
                                  `${user.first_name} ${user.last_name}`
                                )
                              }
                            >
                              <Eye className="h-5 w-5 text-white" />
                            </button>
                          </div>
                          <div>
                            <h3 className="font-medium">
                              {user.first_name} {user.last_name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                            <div className="flex items-center mt-1">
                              <Badge
                                variant="outline"
                                className="text-xs bg-amber-100 text-amber-800 border-amber-200"
                              >
                                {value} Verification
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
                              {user.wallet_address}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Phone</p>
                            <p>+91 {user.phone_number}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Location</p>
                            <p>
                              {user.location[0]?.constituency_name},{" "}
                              {user.location[0]?.district_name}
                            </p>
                          </div>
                        </div>
                        {status === "pending" && (
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
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Approve and Reject Dialogs */}
      <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve {selectedUser?.first_name}{" "}
              {selectedUser?.last_name}? This will allow them to participate in
              elections.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={approve_user.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmApprove}
              className="bg-green-600 hover:bg-green-700"
              disabled={approve_user.isPending}
            >
              <Shield className="h-4 w-4 mr-0" /> Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject User</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting {selectedUser?.first_name}{" "}
              {selectedUser?.last_name}. This will be shared with the user so
              they can address the issues and reapply.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="p-1 pt-0">
            <Textarea
              placeholder="Enter reason for rejection..."
              value={rejectedReason}
              onChange={(e) => setRejectedReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={reject_user.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmReject}
              className="bg-red-500 hover:bg-red-700"
              disabled={reject_user.isPending}
            >
              <X className="h-4 w-4" /> Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={viewImageDialogOpen} onOpenChange={setViewImageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>{selectedImage?.title}</DialogTitle>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
            {selectedImage && (
              <img
                src={selectedImage.url || "/placeholder.svg"}
                alt={selectedImage.title}
                style={{ objectFit: "cover" }}
                className="w-full h-full"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
