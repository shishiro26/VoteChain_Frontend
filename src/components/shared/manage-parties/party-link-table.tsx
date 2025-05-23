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
  console.log("status", status);
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
        {party_data.map((link) => {
          const url = `${window.location.origin}/party/verify/?walletAddress=${link.leader_wallet_address}&token=${link.tokens[0].token}`;
          return (
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
                {link.tokens[0].expiryTime
                  ? formatDate(new Date(link.tokens[0].expiryTime))
                  : "-"}
              </TableCell>
              <TableCell>
                {getLinkStatusBadge(link.tokens[0].status.toLowerCase())}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {link.tokens[0].status === "ACTIVE" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          copyToClipboard(url);
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
                  {link.tokens[0].status === "EXPIRED" && (
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
          );
        })}
      </TableBody>
    </Table>
  );
};

export default PartyLinkTable;
