import { useState } from "react";
import {
  CardFooter,
  CardTitle,
  Card,
  CardDescription,
  CardHeader,
  CardContent,
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
import { CheckCircle, Mail, Wallet, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { useApprovePartyMember, useRejectPartyMember } from "@/api";
import { toast } from "sonner";
import { getPartyContract } from "@/utils/getContracts";
import { api } from "@/api/axios";

type PartyMember = {
  id: string;
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
  userId: string;
};

const PendingUserRequests = ({
  partyMembers,
  partyId,
}: {
  partyMembers: PartyMember[];
  partyId: string;
}) => {
  const [processingRequestId, setProcessingRequestId] = useState<string | null>(
    null
  );

  const approveUser = useApprovePartyMember();
  const rejectUser = useRejectPartyMember();

  const handleApproveRequest = async (userId: string) => {
    setProcessingRequestId(userId);
    const partyContract = await getPartyContract();
    const tx = await partyContract.acceptInvite();
    const receipt = await tx.wait();
    const payload = {
      transactionHash: receipt.hash,
      from: receipt.from,
      to: receipt.to,
      blockNumber: receipt.blockNumber,
      status: receipt.status === 1 ? "SUCCESS" : "FAILED",
      amount: receipt.gasUsed.toString(),
      type: "PARTY MEMBER APPROVAL",
    };

    approveUser.mutate(
      { partyId, userId },
      {
        onSuccess: async () => {
          await api.post("/api/v1/auth/create-transaction", payload);
          toast.success("User approved successfully", {
            description: "The user can participate in the election now",
          });
        },

        onSettled: () => {
          setProcessingRequestId(null);
        },
      }
    );
  };

  const handleRejectRequest = async (userId: string) => {
    setProcessingRequestId(userId);
    const partyContract = await getPartyContract();
    const tx = await partyContract.rejectMember(
      partyMembers.find((m) => m.userId === userId)?.walletAddress
    );
    const receipt = await tx.wait();
    const payload = {
      transactionHash: receipt.hash,
      from: receipt.from,
      to: receipt.to,
      blockNumber: receipt.blockNumber,
      status: receipt.status === 1 ? "SUCCESS" : "FAILED",
      amount: receipt.gasUsed.toString(),
      type: "PARTY MEMBER REJECTION",
    };
    rejectUser.mutate(
      { partyId, userId },
      {
        onSuccess: async () => {
          await api.post("/api/v1/auth/create-transaction", payload);
          toast.success("User rejected successfully", {
            description: "The user can re apply for membe rship in the future",
          });
        },
        onSettled: () => {
          setProcessingRequestId(null);
        },
      }
    );
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
        {partyMembers.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partyMembers.map((request) => (
                  <TableRow key={request.userId}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={request.profileImage || "/placeholder.svg"}
                            alt={request.firstName}
                          />
                          <AvatarFallback>
                            {request.firstName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {request.firstName} {request.lastName}
                          </p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Mail className="w-3 h-3 mr-1" /> {request.email}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                            <Wallet className="w-3 h-3 mr-1" />{" "}
                            {request.walletAddress.substring(0, 10)}...
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{request.state_name}</span>
                        <span className="text-xs text-muted-foreground">
                          {request.constituency_name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(request.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-500 hover:text-green-700"
                          onClick={() => handleApproveRequest(request.userId)}
                          disabled={processingRequestId === request.userId}
                        >
                          {processingRequestId === request.userId ? (
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
                          onClick={() => handleRejectRequest(request.userId)}
                          disabled={processingRequestId === request.userId}
                        >
                          {processingRequestId === request.userId ? (
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
      {partyMembers.length > 0 && (
        <CardFooter className="border-t pt-4">
          <div className="text-sm text-muted-foreground">
            Showing {partyMembers.length} of {partyMembers.length} pending
            requests
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default PendingUserRequests;
