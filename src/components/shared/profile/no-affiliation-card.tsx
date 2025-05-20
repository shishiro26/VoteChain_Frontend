import { useNavigate } from "react-router";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flag } from "lucide-react";

const NoAffiliationCard = ({ link }: { link: string }) => {
  const navigate = useNavigate();
  return (
    <Card>
      <CardHeader>
        <CardTitle>No Party Affiliation</CardTitle>
        <CardDescription>
          You are not currently affiliated with any political party
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center py-8">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
          <Flag className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">Join a Political Party</h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          Joining a political party allows you to participate in party
          activities, support candidates, and even run for office.
        </p>
        <Button onClick={() => navigate(link)}>Browse Parties</Button>
      </CardContent>
    </Card>
  );
};

export default NoAffiliationCard;
