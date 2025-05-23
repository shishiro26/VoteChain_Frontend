import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader } from "../loaders/loader";
import { Button } from "@/components/ui/button";

// Mock data (replace with API response)
const mockRequests = [
  {
    id: "req1",
    name: "Jane Doe",
    email: "jane@example.com",
    requestDate: "2024-05-18",
    profileImage: "",
  },
  {
    id: "req2",
    name: "John Smith",
    email: "john@example.com",
    requestDate: "2024-05-19",
    profileImage: "",
  },
];

const PartyMembersRequests = () => {
  const [membershipRequests, setMembershipRequests] = useState(mockRequests);
  const [processingRequestId, setProcessingRequestId] = useState<string | null>(
    null
  );

  const handleApproveRequest = async (id: string) => {
    setProcessingRequestId(id);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMembershipRequests((prev) => prev.filter((req) => req.id !== id));
      // You can trigger success toast here
    } catch (error) {
      console.error("Error approving request", error);
    } finally {
      setProcessingRequestId(null);
    }
  };

  const handleRejectRequest = async (id: string) => {
    setProcessingRequestId(id);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMembershipRequests((prev) => prev.filter((req) => req.id !== id));
      // You can trigger rejection toast here
    } catch (error) {
      console.error("Error rejecting request", error);
    } finally {
      setProcessingRequestId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Membership Requests</CardTitle>
        <CardDescription>
          Review and approve or reject membership requests for your party
        </CardDescription>
      </CardHeader>
      <CardContent>
        {membershipRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {membershipRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={request.profileImage || "/placeholder.svg"}
                            alt={request.name}
                          />
                          <AvatarFallback>
                            {request.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{request.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{request.email}</TableCell>
                    <TableCell>
                      {new Date(request.requestDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-500 hover:text-green-700"
                          onClick={() => handleApproveRequest(request.id)}
                          disabled={processingRequestId === request.id}
                        >
                          {processingRequestId === request.id ? (
                            <Loader size="sm" className="mr-1" />
                          ) : (
                            <CheckCircle className="w-4 h-4 mr-1" />
                          )}
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive/80"
                          onClick={() => handleRejectRequest(request.id)}
                          disabled={processingRequestId === request.id}
                        >
                          {processingRequestId === request.id ? (
                            <Loader size="sm" className="mr-1" />
                          ) : (
                            <XCircle className="w-4 h-4 mr-1" />
                          )}
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Pending Requests</h3>
            <p className="text-muted-foreground">
              There are currently no pending membership requests for your party.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PartyMembersRequests;
