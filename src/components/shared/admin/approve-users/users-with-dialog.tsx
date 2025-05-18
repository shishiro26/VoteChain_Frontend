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
import { formaDate } from "@/utils/formatDate";

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
  aadhar_image: string;
  location: Location[];
  created_at: string;
  submitted_at: string;
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
  console.log("user", user);
  console.log("submitted_at", user?.submitted_at);
  if (!user) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={user.profile_image || "/placeholder.svg"}
                  alt={user.first_name}
                />
                <AvatarFallback>{user.first_name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-2xl">
                  {user.first_name} {user.last_name}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="outline"
                    className={
                      user.status === "approved"
                        ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
                        : user.status === "pending"
                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200"
                        : "bg-red-100 text-red-800 hover:bg-red-100 border-red-200"
                    }
                  >
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </Badge>
                  <span>•</span>
                  <span>
                    Registered on {formaDate(new Date(user.created_at))}
                  </span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="details">Personal Details</TabsTrigger>
              <TabsTrigger value="documents">ID Verification</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Email
                      </h4>
                      <p className="flex items-center gap-2 mt-1">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {user.email}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Phone
                      </h4>
                      <p className="flex items-center gap-2 mt-1">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        +91 {user.phone_number}
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
                    <p className="mt-1">{user.phone_number}</p>
                  </div>

                  <Separator className="my-4" />

                  <div>
                    <h4 className="text-sm font-medium mb-3">ID Proof Image</h4>
                    <AspectRatio
                      ratio={16 / 9}
                      className="bg-muted rounded-md overflow-hidden relative group"
                    >
                      <img
                        src={user.profile_image || "/placeholder.svg"}
                        alt={`${user.first_name}'s ID proof`}
                        className="object-cover w-full h-full"
                      />
                      <button
                        onClick={() => setFullImageView(user.profile_image)}
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
                          {formaDate(new Date(user.created_at))}
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
                          {formaDate(new Date(user?.submitted_at))}{" "}
                        </p>
                      </div>
                    </div>

                    {user.status === "approved" && (
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
                            {formaDate(new Date(user?.submitted_at))}
                          </p>
                        </div>
                      </div>
                    )}

                    {user.status === "rejected" && (
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
