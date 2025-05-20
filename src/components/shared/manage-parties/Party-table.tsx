import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { getPartyStatusBadge } from "@/utils/status-badge";
import { Eye } from "lucide-react";

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
            <TableCell>{getPartyStatusBadge(party.status)}</TableCell>
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
