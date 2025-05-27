import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Vote,
  Award,
  Flag,
  Settings,
  Shield,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router";

const adminCapabilities = [
  {
    title: "User Management",
    description: "Review and approve user registrations for voting eligibility",
    icon: Users,
    href: "/admin/approve-users",
    actions: [
      "Review pending users",
      "Approve/reject registrations",
      "Manage user status",
    ],
    status: "Active",
    color: "bg-blue-500",
  },
  {
    title: "Election Creation",
    description: "Create and configure new elections with detailed settings",
    icon: Vote,
    href: "/admin/create-election",
    actions: [
      "Set election details",
      "Configure constituencies",
      "Set voting periods",
    ],
    status: "Core Feature",
    color: "bg-green-500",
  },
  {
    title: "Party Management",
    description: "Oversee political party registrations and verifications",
    icon: Flag,
    href: "/admin/manage-parties",
    actions: [
      "Verify party details",
      "Approve/reject parties",
      "Monitor party activities",
    ],
    status: "Active",
    color: "bg-orange-500",
  },
  {
    title: "Results Declaration",
    description: "Finalize and declare election results officially",
    icon: Award,
    href: "/admin/declare-results",
    actions: [
      "Review vote counts",
      "Declare winners",
      "Publish official results",
    ],
    status: "Critical",
    color: "bg-red-500",
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Admin Control Center
        </h1>
        <p className="text-muted-foreground">
          Manage elections, users, and parties with comprehensive administrative
          tools
        </p>
      </div>

      {/* Admin Capabilities */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Administrative Capabilities</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {adminCapabilities.map((capability, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-all duration-200"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-lg ${capability.color} text-white`}
                    >
                      <capability.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {capability.title}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {capability.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {capability.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Key Actions:</h4>
                  <ul className="space-y-1">
                    {capability.actions.map((action, actionIndex) => (
                      <li
                        key={actionIndex}
                        className="text-sm text-muted-foreground flex items-center"
                      >
                        <div className="w-1 h-1 bg-primary rounded-full mr-2" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button asChild className="w-full">
                  <Link to={capability.href}>
                    Access {capability.title}{" "}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* System Overview */}
      <Card className="border-2 border-dashed">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>System Administration</CardTitle>
          </div>
          <CardDescription>
            Comprehensive tools for managing the VoteChain election platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <h4 className="font-medium">User Management</h4>
              <p className="text-sm text-muted-foreground">
                Complete control over user registrations, approvals, and access
                management
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Election Control</h4>
              <p className="text-sm text-muted-foreground">
                End-to-end election management from creation to result
                declaration
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Platform Security</h4>
              <p className="text-sm text-muted-foreground">
                Robust verification systems and fraud prevention mechanisms
              </p>
            </div>
          </div>
          <div className="flex justify-center pt-4">
            <Button variant="outline" asChild>
              <Link to="/admin/settings">
                <Settings className="mr-2 h-4 w-4" />
                Platform Settings
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
