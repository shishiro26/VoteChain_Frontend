import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  CrownIcon,
  Users,
  X,
} from "lucide-react";

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

export const getPartyStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return (
        <Badge
          variant="outline"
          className="bg-green-500/10 text-green-500 border-green-500/20"
        >
          <CheckCircle className="w-3 h-3 mr-1" /> Verified
        </Badge>
      );
    case "pending":
      return (
        <Badge
          variant="outline"
          className="bg-amber-500/10 text-amber-500 border-amber-500/20"
        >
          <Clock className="w-3 h-3 mr-1" /> Pending
        </Badge>
      );
    case "rejected":
      return (
        <Badge
          variant="outline"
          className="bg-destructive/10 text-destructive border-destructive/20"
        >
          <AlertTriangle className="w-3 h-3 mr-1" /> Rejected
        </Badge>
      );
    default:
      return null;
  }
};

export const getMembershipBadge = (status: string | null) => {
  switch (status) {
    case "leader":
      return (
        <Badge className="bg-primary text-primary-foreground">
          <CrownIcon className="w-3 h-3 mr-1" /> Party Leader
        </Badge>
      );
    case "member":
      return (
        <Badge variant="secondary">
          <Users className="w-3 h-3 mr-1" /> Member
        </Badge>
      );
    case "pending":
      return (
        <Badge
          variant="outline"
          className="bg-amber-500/10 text-amber-500 border-amber-500/20"
        >
          <Clock className="w-3 h-3 mr-1" /> Membership Pending
        </Badge>
      );
    default:
      return null;
  }
};

export const getElectionStatusPage = (status: string) => {
  switch (status) {
    case "UPCOMING":
      return (
        <Badge
          variant="outline"
          className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200"
        >
          <Clock className="h-3 w-3 mr-1" />
          Upcoming
        </Badge>
      );
    case "ONGOING":
      return (
        <Badge
          variant="outline"
          className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
        >
          <CheckCircle className="h-3 w-3 mr-1" />
          Ongoing
        </Badge>
      );
    case "COMPLETED":
      return (
        <Badge
          variant="outline"
          className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200"
        >
          <CheckCircle className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
    default:
      return null;
  }
};

export const getElectionImportanceBadge = (
  importance: "HIGH" | "MEDIUM" | "LOW"
) => {
  switch (importance) {
    case "HIGH":
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="outline"
                className="bg-red-50 text-red-600 border-red-200"
              >
                High Priority
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>National or State level election with high significance</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    case "MEDIUM":
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-600 border-blue-200"
              >
                Medium Priority
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>District or municipal level election</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    case "LOW":
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="outline"
                className="bg-gray-50 text-gray-600 border-gray-200"
              >
                Local Priority
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Local panchayat or small constituency election</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    default:
      return null;
  }
};
