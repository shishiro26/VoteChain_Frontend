import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, MapPin, Building } from "lucide-react";

const userData = {
  partyAffiliation: {
    constituency: "Downtown",
    state: "California",
  },
};

const UserLocation = () => {
  const { partyAffiliation } = userData;
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
          <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Eligible to Vote</p>
                <p className="text-sm text-muted-foreground">
                  Your account is verified and eligible to vote in elections
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className="bg-green-500/20 text-green-700 hover:bg-green-500/30"
            >
              Active
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-primary" />
                <p className="font-medium">Registered Constituency</p>
              </div>
              <p>{partyAffiliation.constituency}</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Building className="h-4 w-4 text-primary" />
                <p className="font-medium">Registered State</p>
              </div>
              <p>{partyAffiliation.state}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserLocation;
