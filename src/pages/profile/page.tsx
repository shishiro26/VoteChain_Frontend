import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  User,
  Mail,
  Phone,
  Clock,
  Shield,
  AlertCircle,
  RefreshCw,
  Flag,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useNavigate } from "react-router";
import UserParty from "@/components/shared/profile/user-party";
import UserVoting from "@/components/shared/profile/user-voting";
import UserWallet from "@/components/shared/profile/user-wallet";
import UserLocation from "@/components/shared/profile/user-location";
import { formatDate } from "@/utils/formatDate";
import { Loader } from "@/components/ui/loader";
import { useWallet } from "@/store/useWallet";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const location = useLocation();
  const walletAddress = location.pathname.split("/")[2];
  const { profile: user } = useWallet();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (user.walletAddress !== walletAddress) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Wallet Not Connected</CardTitle>
            <CardDescription>
              Please connect your MetaMask wallet to update your profile.
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

  const verificationStatus = user.status;

  return (
    <div className="container mx-auto px-4 py-4">
      {user.status === "REJECTED" && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Verification Rejected</AlertTitle>
          <AlertDescription>
            <p className="mt-2">Profile Data is incomplete</p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => {}}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Resubmit Verification
              </Button>
              <Button variant="ghost" size="sm" onClick={() => {}}>
                Contact Support
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-md mb-2">
          <TabsTrigger value="overview" className="flex-1">
            Overview
          </TabsTrigger>
          <TabsTrigger value="party" className="flex-1">
            Party Affiliation
          </TabsTrigger>
          <TabsTrigger value="voting" className="flex-1">
            Voting History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card className="border border-border pt-0 rounded-lg">
                <CardHeader
                  className={`${
                    verificationStatus === "APPROVED"
                      ? "bg-primary/5"
                      : verificationStatus === "REJECTED"
                      ? "bg-destructive/5"
                      : "bg-amber-500/5"
                  } border-b border-border py-6 rounded-lg`}
                >
                  <CardTitle>My Profile</CardTitle>
                  <CardDescription>Your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                        <img
                          src={user.profileImage || "/placeholder.svg"}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div
                        className={`absolute -bottom-2 -right-2 ${
                          user.status === "APPROVED"
                            ? "bg-green-500"
                            : user.status === "REJECTED"
                            ? "bg-destructive"
                            : "bg-amber-500"
                        } text-white p-1 rounded-full`}
                      >
                        {user.status === "APPROVED" ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : user.status === "REJECTED" ? (
                          <AlertCircle className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Full Name
                        </p>
                        <p className="font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{user.phoneNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Verification Status
                        </p>
                        <p
                          className={`font-medium ${
                            verificationStatus === "APPROVED"
                              ? "text-green-500"
                              : verificationStatus === "REJECTED"
                              ? "text-destructive"
                              : "text-amber-500"
                          }`}
                        >
                          {verificationStatus === "APPROVED"
                            ? "Approved"
                            : verificationStatus === "REJECTED"
                            ? "Rejected"
                            : "Pending Verification"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Last Login
                        </p>
                        <p className="font-medium">{formatDate(new Date())}</p>
                      </div>
                    </div>

                    {user.party && (
                      <div className="flex items-center gap-3">
                        <Flag className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Party Affiliation
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{user.party.symbol}</span>
                            <p className="font-medium">{user.party.name}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border pt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/update-profile")}
                    disabled={
                      verificationStatus === "APPROVED" ||
                      verificationStatus === "PENDING"
                    }
                  >
                    {verificationStatus === "APPROVED"
                      ? "Profile Updated"
                      : verificationStatus === "REJECTED"
                      ? "Resubmit Verification"
                      : "Profile Under Review"}
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <UserWallet />
              <UserLocation />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="party">
          <UserParty />
        </TabsContent>

        <TabsContent value="voting">
          <UserVoting />
        </TabsContent>
      </Tabs>
    </div>
  );
}
