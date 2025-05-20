import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

const userData = {
  votingHistory: [
    {
      election: "Presidential Election 2024",
      date: "2024-11-05",
      txHash: "0x1234567890abcdef1234567890abcdef12345678",
    },
    {
      election: "Local Council Election 2023",
      date: "2023-09-15",
      txHash: "0xabcdef1234567890abcdef1234567890abcdef12",
    },
    {
      election: "State Assembly Election 2023",
      date: "2023-06-01",
      txHash: "0x7890abcdef1234567890abcdef1234567890abcd",
    },
    {
      election: "Municipal Election 2022",
      date: "2022-11-08",
      txHash: "0x4567890abcdef1234567890abcdef1234567890ef",
    },
  ],
};

const UserVoting = () => {
  return (
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
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userData.votingHistory.map((vote, index) => (
                <tr key={index} className="border-b hover:bg-muted/50">
                  <td className="py-2 px-4">{vote.election}</td>
                  <td className="py-2 px-4">{vote.date}</td>
                  <td className="py-2 px-4 font-mono text-xs">{vote.txHash}</td>
                  <td className="py-2 px-4">
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {userData.votingHistory.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">
              You haven't voted in any elections yet.
            </p>
          </div>
        )}

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Upcoming Elections</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-background rounded-md">
              <div>
                <p className="font-medium">
                  Municipal Corporation Election 2023
                </p>
                <p className="text-sm text-muted-foreground">
                  December 15, 2023
                </p>
              </div>
              <Badge>Upcoming</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-background rounded-md">
              <div>
                <p className="font-medium">State Assembly Election 2024</p>
                <p className="text-sm text-muted-foreground">
                  February 10, 2024
                </p>
              </div>
              <Badge variant="outline">Scheduled</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserVoting;
