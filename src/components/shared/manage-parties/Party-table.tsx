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
            <TableCell>{party.partyMembersCount.toLocaleString()}</TableCell>
            <TableCell>
              {getPartyStatusBadge(party.logo ? "active" : "pending")}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {party.logo && (
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
