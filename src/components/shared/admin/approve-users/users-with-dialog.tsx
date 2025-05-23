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
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Mail,
  Phone,
  MapPin,
  FileText,
  Check,
  X,
  AlertTriangle,
  Maximize,
} from "lucide-react";
import { formatDate } from "@/utils/formatDate";

type Location = {
  state_name: string;
  district_name: string;
  mandal_name: string;
  constituency_name: string;
};

type User = {
  id: string;
  walletAddress: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profileImage: string;
  aadharImage: string;
  location: Location[];
  createdAt: string;
  submittedAt: string;
  aadharNumber: string;
  dob: string;
};

interface UserDetailsDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailsDialog({
  user,
  open,
  onOpenChange,
}: UserDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [fullImageView, setFullImageView] = useState<string | null>(null);
  if (!user) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={user.profileImage || "/placeholder.svg"}
                  alt={user.firstName}
                />
                <AvatarFallback>{user.firstName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-2xl">
                  {user.firstName} {user.lastName}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="outline"
                    className={
                      user.status === "APPROVED"
                        ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
                        : user.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200"
                        : "bg-red-100 text-red-800 hover:bg-red-100 border-red-200"
                    }
                  >
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </Badge>
                  <span>•</span>
                  <span>
                    Registered on {formatDate(new Date(user.createdAt))}
                  </span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
            <TabsList className="grid grid-cols-3 mb-2">
              <TabsTrigger value="details">Personal Details</TabsTrigger>
              <TabsTrigger value="documents">ID Verification</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>
                      Basic information about the user
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Age
                        </h4>
                        <p className="mt-1">
                          {new Date().getFullYear() -
                            new Date(user.dob).getFullYear()}{" "}
                          years
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Phone
                        </h4>
                        <p className="flex items-center gap-2 mt-1">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          +91 {user.phoneNumber}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Email
                      </h4>
                      <p className="flex items-center gap-2 mt-1">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {user.email}
                      </p>
                    </div>

                    {user.location.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Address
                        </h4>
                        <p className="flex items-start gap-2 mt-1">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                          <span>
                            {user.location[0]?.constituency_name},{" "}
                            {user.location[0]?.district_name},{" "}
                            {user.location[0]?.state_name} -
                          </span>
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>ID Proof Details</CardTitle>
                  <CardDescription>
                    Verification documents provided by the user
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      ID Type
                    </h4>
                    <p className="mt-1">Aadhar Card</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      ID Number
                    </h4>
                    <p className="mt-1">{user.aadharNumber}</p>
                  </div>

                  <Separator className="my-4" />

                  <div>
                    <h4 className="text-sm font-medium mb-3">ID Proof Image</h4>
                    <AspectRatio
                      ratio={16 / 9}
                      className="bg-muted rounded-md overflow-hidden relative group"
                    >
                      <img
                        src={user.aadharImage || "/placeholder.svg"}
                        alt={`${user.aadharNumber}'s ID proof`}
                        className="object-cover w-full h-full"
                      />
                      <button
                        onClick={() => setFullImageView(user.aadharImage)}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                      >
                        <Maximize className="h-6 w-6" />
                        <span className="ml-2">View Full Size</span>
                      </button>
                    </AspectRatio>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Log</CardTitle>
                  <CardDescription>
                    Recent user activities and system events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Profile Created</p>
                        <p className="text-sm text-muted-foreground">
                          User registered and created their profile
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(new Date(user.createdAt))}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium">Verification Pending</p>
                        <p className="text-sm text-muted-foreground">
                          User submitted documents for verification on
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(new Date(user?.submittedAt))}{" "}
                        </p>
                      </div>
                    </div>

                    {user.status === "APPROVED" && (
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">User Approved</p>
                          <p className="text-sm text-muted-foreground">
                            Admin approved user verification on
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(new Date(user?.submittedAt))}
                          </p>
                        </div>
                      </div>
                    )}

                    {user.status === "REJECTED" && (
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                          <X className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium">User Rejected</p>
                          <p className="text-sm text-muted-foreground">
                            Admin rejected user verification
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date().toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {fullImageView && (
        <Dialog
          open={!!fullImageView}
          onOpenChange={() => setFullImageView(null)}
        >
          <DialogContent className="max-w-5xl p-0 overflow-hidden">
            <div className="relative">
              <img
                src={fullImageView || "/placeholder.svg"}
                alt="Full size view"
                className="w-full h-auto"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70 hover:text-white"
                onClick={() => setFullImageView(null)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
