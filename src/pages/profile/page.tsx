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
import { useWallet } from "@/store/useWallet";
import { useNavigate } from "react-router";
import UserParty from "@/components/shared/profile/user-party";
import UserVoting from "@/components/shared/profile/user-voting";
import UserWallet from "@/components/shared/profile/user-wallet";
import UserLocation from "@/components/shared/profile/user-location";

export default function ProfilePage() {
  const { wallet, is_profile_complete } = useWallet();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "verified" | "rejected"
  >("pending");
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [rejectedFields, setRejectedFields] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!wallet) {
      navigate("/");
    } else if (!is_profile_complete) {
      navigate("/update-profile");
    } else {
      const resubmitted = new URLSearchParams(window.location.search).get(
        "resubmitted"
      );
      if (resubmitted === "true") {
        setVerificationStatus("pending");
      } else {
        // In a real app, fetch user verification status from API
        // This is mocked for demonstration
        fetchUserVerificationStatus();
      }
    }
  }, [wallet, is_profile_complete, navigate]);

  // Mock function to fetch user verification status
  const fetchUserVerificationStatus = () => {
    // For demo purposes, randomly set the verification status
    // In a real app, this would be an API call to get the actual status
    const statuses: ("pending" | "verified" | "rejected")[] = [
      "pending",
      "verified",
      "rejected",
    ];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    setVerificationStatus(randomStatus);

    if (randomStatus === "rejected") {
      // Mock rejection scenarios
      const rejectionScenarios = [
        {
          reason:
            "Your ID document was blurry and we couldn't verify your details. Please resubmit a clearer image of your government-issued ID.",
          fields: ["aadhaarImage"],
        },
        {
          reason:
            "The address in your profile doesn't match your ID document. Please update your location details.",
          fields: ["state", "district", "constituency", "pincode"],
        },
        {
          reason:
            "Your name doesn't match your ID document. Please update your name to match exactly as it appears on your ID.",
          fields: ["firstName", "lastName"],
        },
      ];

      const selectedScenario =
        rejectionScenarios[
          Math.floor(Math.random() * rejectionScenarios.length)
        ];
      setRejectionReason(selectedScenario.reason);
      setRejectedFields(selectedScenario.fields);
    }
  };

  const handleResubmit = () => {
    if (rejectedFields.length > 0 && rejectionReason) {
      // Navigate to update profile with rejected fields and reason
      navigate(
        `/update-profile?mode=resubmit&fields=${rejectedFields.join(
          ","
        )}&reason=${encodeURIComponent(rejectionReason)}`
      );
    } else {
      navigate("/update-profile");
    }
  };

  const userData = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "9876543210",
    walletAddress: wallet,
    verificationStatus: verificationStatus,
    lastLogin: "2023-11-05 14:32:15",
    profileImage: "/placeholder.svg?height=200&width=200",
    votingHistory: [
      {
        election: "National General Election 2023",
        date: "2023-11-05",
        txHash: "0x8a35d54c...b72f",
      },
      {
        election: "University Student Council",
        date: "2023-10-28",
        txHash: "0x7b42e98d...c45a",
      },
    ],
    // Party affiliation data
    partyAffiliation: {
      isAffiliated: true,
      partyName: "Progressive Democratic Party",
      partySymbol: "🌟",
      partyLogo: "/placeholder.svg?height=100&width=100",
      role: "Leader", // or "Member"
      joinDate: "2023-09-15",
      membershipId: "PDP-2023-1254",
      constituency: "Worli",
      state: "Maharashtra",
    },
  };

  return (
    <div className="container mx-auto px-4 py-4">
      {verificationStatus === "rejected" && rejectionReason && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Verification Rejected</AlertTitle>
          <AlertDescription>
            <p className="mt-2">{rejectionReason}</p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={handleResubmit}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Resubmit Verification
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setVerificationStatus("pending")}
              >
                Contact Support
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-md  mb-2">
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
              <Card className="border border-border py-0 rounded-lg">
                <CardHeader
                  className={`${
                    verificationStatus === "verified"
                      ? "bg-primary/5"
                      : verificationStatus === "rejected"
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
                          src={userData.profileImage || "/placeholder.svg"}
                          alt={`${userData.firstName} ${userData.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div
                        className={`absolute -bottom-2 -right-2 ${
                          verificationStatus === "verified"
                            ? "bg-green-500"
                            : verificationStatus === "rejected"
                            ? "bg-destructive"
                            : "bg-amber-500"
                        } text-white p-1 rounded-full`}
                      >
                        {verificationStatus === "verified" ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : verificationStatus === "rejected" ? (
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
                          {userData.firstName} {userData.lastName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{userData.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{userData.phone}</p>
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
                            verificationStatus === "verified"
                              ? "text-green-500"
                              : verificationStatus === "rejected"
                              ? "text-destructive"
                              : "text-amber-500"
                          }`}
                        >
                          {verificationStatus === "verified"
                            ? "Verified"
                            : verificationStatus === "rejected"
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
                        <p className="font-medium">{userData.lastLogin}</p>
                      </div>
                    </div>

                    {userData.partyAffiliation.isAffiliated && (
                      <div className="flex items-center gap-3">
                        <Flag className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Party Affiliation
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xl">
                              {userData.partyAffiliation.partySymbol}
                            </span>
                            <p className="font-medium">
                              {userData.partyAffiliation.partyName}
                            </p>
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
                  >
                    Update Profile
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
