import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertTriangle, Eye } from "lucide-react";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return (
        <Badge
          variant="outline"
          className="bg-green-500/10 text-green-500 border-green-500/20"
        >
          <CheckCircle className="w-3 h-3 mr-1" /> Active
        </Badge>
      );
    case "pending":
      return (
        <Badge
          variant="outline"
          className="bg-amber-500/10 text-amber-500 border-amber-500/20"
        >
          <Clock className="w-3 h-3 mr-1" /> Pending Verification
        </Badge>
      );
    case "expired":
      return (
        <Badge
          variant="outline"
          className="bg-destructive/10 text-destructive border-destructive/20"
        >
          <AlertTriangle className="w-3 h-3 mr-1" /> Expired
        </Badge>
      );
    default:
      return null;
  }
};

type Party = {
  id: string;
  name: string;
  symbol: string;
  abbreviation: string;
  logo: string;
  description: string;
  contact_email: string;
  contact_phone: string;
  website: string;
  leader_name: string;
  leader_wallet_address: string;
  leader_email: string;
  verify_token: null | string;
  token_url: null | string;
  token_expiry: null | string;
  candidate_count: number;
  created_at: string;
  status: string;
  link_status: string;
};

const Party_table = ({
  party,
  handleViewParty,
}: {
  party: Party[];
  handleViewParty: (party: Party) => void;
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Party</TableHead>
          <TableHead>Symbol</TableHead>
          <TableHead>Leader</TableHead>
          <TableHead>Members</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {party.map((party) => (
          <TableRow key={party.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <img
                  src={party.logo || "/placeholder.svg"}
                  alt={`${party.name} logo`}
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <div>
                  <p className="font-medium">{party.name}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <span className="text-2xl">{party.symbol}</span>
            </TableCell>
            <TableCell>
              <p>{party.leader_name}</p>
              <p className="text-xs text-muted-foreground">
                {party.leader_email}
              </p>
            </TableCell>
            <TableCell>{party.candidate_count.toLocaleString()}</TableCell>
            <TableCell>{getStatusBadge(party.status)}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {party.status !== "pending" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewParty(party)}
                  >
                    <Eye className="w-4 h-4 mr-1" /> View
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Party_table;
