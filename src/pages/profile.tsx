import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, User, Mail, Phone, Clock, Shield } from "lucide-react";
import { useWallet } from "@/store/useWallet";
import { useNavigate } from "react-router";

export default function ProfilePage() {
  const { wallet, is_profile_complete } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    if (!wallet) {
      navigate("/");
    } else if (!is_profile_complete) {
      navigate("/update-profile");
    }
  }, [wallet, is_profile_complete, navigate]);

  if (!wallet) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Wallet Not Connected</CardTitle>
            <CardDescription>
              Please connect your MetaMask wallet to view your profile.
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
              Please complete your profile before accessing this page.
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

  const userData = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "9876543210",
    walletAddress: wallet,
    verificationStatus: "Verified",
    lastLogin: "2023-11-05 14:32:15",
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
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="border border-border">
            <CardHeader className="bg-primary/5 border-b border-border">
              <CardTitle>My Profile</CardTitle>
              <CardDescription>Your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1 rounded-full">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
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
                    <p className="font-medium text-green-500">
                      {userData.verificationStatus}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Last Login</p>
                    <p className="font-medium">{userData.lastLogin}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border pt-4">
              <Button variant="outline" className="w-full" disabled>
                Profile cannot be updated
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Wallet Information</CardTitle>
              <CardDescription>Your blockchain wallet details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">
                  Connected Wallet Address
                </p>
                <p className="font-mono break-all">{userData.walletAddress}</p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Connection Status
                  </p>
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <p className="font-medium">Connected</p>
                  </div>
                </div>

                <Button variant="outline" size="sm">
                  View on Etherscan
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Voting History</CardTitle>
              <CardDescription>
                Record of your past votes on the blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-4 text-left">Election</th>
                      <th className="py-2 px-4 text-left">Date</th>
                      <th className="py-2 px-4 text-left">Transaction Hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.votingHistory.map((vote, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-4">{vote.election}</td>
                        <td className="py-2 px-4">{vote.date}</td>
                        <td className="py-2 px-4 font-mono text-xs">
                          {vote.txHash}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
