import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, X } from "lucide-react";

export const getStatusBadge = (status: string) => {
  switch (status) {
    case "approved":
      return (
        <Badge
          variant="outline"
          className="bg-green-500/10 text-green-500 border-green-500/20"
        >
          <CheckCircle className="w-3 h-3 mr-1" /> Approved
        </Badge>
      );
    case "pending":
      return (
        <Badge
          variant="outline"
          className="bg-amber-500/10 text-amber-500 border-amber-500/20"
        >
          <AlertTriangle className="w-3 h-3 mr-1" /> Pending
        </Badge>
      );
    case "rejected":
      return (
        <Badge
          variant="outline"
          className="bg-destructive/10 text-destructive border-destructive/20"
        >
          <X className="w-3 h-3 mr-1" /> Rejected
        </Badge>
      );
    default:
      return null;
  }
};
