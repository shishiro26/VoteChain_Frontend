import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Wallet, Trash, User, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

type PartyMember = {
  firstName: string;
  lastName: string;
  role: "PHEAD" | "USER";
  status: "APPROVED" | "PENDING" | "REJECTED";
  email: string;
  walletAddress: string;
  profileImage: string;
  state_name: string;
  constituency_name: string;
  createdAt: string;
};

const PartyMembers = ({
  partyMembers,
  refetch,
}: {
  partyMembers: PartyMember[];
  refetch: () => void;
}) => {
  const [refreshing, setRefreshing] = useState(false);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Party Members</CardTitle>
        <CardDescription>Manage your party members</CardDescription>
      </CardHeader>

      <CardContent>
        {partyMembers.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partyMembers.map((member, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={member.profileImage || "/placeholder.svg"}
                            alt={member.firstName}
                          />
                          <AvatarFallback>
                            {member.firstName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {member.firstName} {member.lastName}
                          </p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Mail className="w-3 h-3 mr-1" /> {member.email}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                            <Wallet className="w-3 h-3 mr-1" />{" "}
                            {member.walletAddress.substring(0, 10)}...
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{member.state_name}</span>
                        <span className="text-xs text-muted-foreground">
                          {member.constituency_name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>
                          {new Date(member.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {member.role === "PHEAD" ? (
                        <Badge className="bg-primary text-primary-foreground">
                          Party Leader
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Member</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {member.role !== "PHEAD" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive/80"
                            onClick={() => {}}
                          >
                            <Trash className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Members Found</h3>
            <p className="text-muted-foreground">
              No members match your filters.
            </p>
          </div>
        )}
      </CardContent>

      {partyMembers.length > 0 && (
        <CardFooter className="border-t pt-4 flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {partyMembers.length} of {partyMembers.length} members
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setRefreshing(true);
              refetch();
              setTimeout(() => {
                setRefreshing(false);
              }, 1000);
            }}
          >
            <RefreshCw
              className={cn("h-4 w-4 mr-2", {
                "animate-spin": refreshing,
              })}
            />{" "}
            Refresh
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default PartyMembers;
