import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Copy, RefreshCcw, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { copyToClipboard } from "@/utils/copy_to_clipboard";
import { formatDate } from "@/utils/formatDate";

const getLinkStatusBadge = (status: string) => {
  switch (status) {
    case "unused":
      return (
        <Badge
          variant="outline"
          className="bg-green-500/10 text-green-500 border-green-500/20"
        >
          <CheckCircle className="w-3 h-3 mr-1" /> Active
        </Badge>
      );
    case "used":
      return (
        <Badge
          variant="outline"
          className="bg-blue-500/10 text-blue-500 border-blue-500/20"
        >
          <CheckCircle className="w-3 h-3 mr-1" /> Used
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

const PartyLinkTable = ({ party_data }: { party_data: Party[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Party Name</TableHead>
          <TableHead>Symbol</TableHead>
          <TableHead>Leader</TableHead>
          <TableHead>Expires</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {party_data.map((link) => (
          <TableRow key={link.id}>
            <TableCell>
              <p className="font-medium">{link.name}</p>
            </TableCell>
            <TableCell>
              <span className="text-2xl">{link.symbol}</span>
            </TableCell>
            <TableCell>
              <p>{link.leader_name}</p>
              <p className="text-xs text-muted-foreground">
                {link.leader_email}
              </p>
            </TableCell>
            <TableCell>
              {link.token_expiry
                ? formatDate(new Date(link.token_expiry))
                : "-"}
            </TableCell>
            <TableCell>{getLinkStatusBadge(link.link_status)}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {link.link_status === "unused" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        copyToClipboard(link.token_url || "");
                      }}
                    >
                      <Copy className="w-4 h-4 mr-1" /> Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive/80"
                      //   onClick={() => handleDeleteLink(link.id)}
                    >
                      <Trash className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </>
                )}
                {link.link_status === "expired" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Regenerate link logic
                      //   toast({
                      //     title: "Link regenerated",
                      //     description:
                      //       "A new link has been generated with a fresh expiry date.",
                      //   });
                    }}
                  >
                    <RefreshCcw className="w-4 h-4 mr-1" /> Regenerate
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

export default PartyLinkTable;
