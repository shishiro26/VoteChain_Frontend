import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, MapPin, Building, AlertCircle, Ban } from "lucide-react";
import { useWallet } from "@/store/useWallet";
import { differenceInYears, parseISO } from "date-fns";

const getStatusInfo = (status: string, isUnderage: boolean) => {
  if (isUnderage) {
    return {
      icon: <Ban className="h-5 w-5 text-red-500" />,
      title: "Not Eligible to Vote",
      message: "You must be at least 18 years old to vote in elections.",
      badge: { text: "Ineligible", color: "bg-red-500/20 text-red-700" },
      background: "bg-red-500/10",
    };
  }

  switch (status) {
    case "PENDING":
      return {
        icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
        title: "Verification Pending",
        message: "Your account is pending admin approval.",
        badge: { text: "Pending", color: "bg-amber-500/20 text-amber-700" },
        background: "bg-amber-500/10",
      };
    case "APPROVED":
      return {
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        title: "Eligible to Vote",
        message: "Your account is verified and eligible to vote in elections.",
        badge: { text: "Active", color: "bg-green-500/20 text-green-700" },
        background: "bg-green-500/10",
      };
    case "REJECTED":
      return {
        icon: <Ban className="h-5 w-5 text-red-500" />,
        title: "Verification Rejected",
        message: "Your account verification has been rejected.",
        badge: { text: "Rejected", color: "bg-red-500/20 text-red-700" },
        background: "bg-red-500/10",
      };
    default:
      return {
        icon: <AlertCircle className="h-5 w-5 text-gray-500" />,
        title: "Not Verified",
        message: "Your account has not yet been verified.",
        badge: { text: "Unverified", color: "bg-gray-200 text-gray-700" },
      };
  }
};

const UserLocation = () => {
  const { profile } = useWallet();

  const dob = profile?.dob;
  const age = dob ? differenceInYears(new Date(), parseISO(dob)) : null;
  const isUnderage = age !== null && age < 18;
  const statusInfo = getStatusInfo(profile?.status || "", isUnderage);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Voting Eligibility</CardTitle>
        <CardDescription>
          Your current voting status and eligibility
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div
            className={`flex items-center justify-between p-4 rounded-lg ${statusInfo.background} border`}
          >
            <div className={`flex items-center gap-3 `}>
              {statusInfo.icon}
              <div>
                <p className="font-medium">{statusInfo.title}</p>
                <p className="text-sm text-muted-foreground">
                  {statusInfo.message}
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className={`${statusInfo.badge.color} hover:opacity-90`}
            >
              {statusInfo.badge.text}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-primary" />
                <p className="font-medium">Registered Constituency</p>
              </div>
              <p>{profile?.location?.constituency || "Not specified"}</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Building className="h-4 w-4 text-primary" />
                <p className="font-medium">Registered State</p>
              </div>
              <p>{profile?.location?.state || "Not specified"}</p>
            </div>
          </div>

          {dob && (
            <div className="text-sm text-muted-foreground mt-2">
              Date of Birth: {new Date(dob).toLocaleDateString()} ({age} years
              old)
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserLocation;
