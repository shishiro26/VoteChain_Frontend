import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminBreadcrumb } from "@/components/ui/admin-breadcrumb";
import { CalendarPlus, FileSpreadsheet, MapPin } from "lucide-react";
import { Link } from "react-router";

export default function CreateElectionPage() {
  return (
    <div>
      <AdminBreadcrumb items={[{ label: "Create Election" }]} />
      <h1 className="text-3xl font-bold mb-8">Create New Election</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="bg-primary/5 border-b border-border">
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Create State-Level Election
            </CardTitle>
            <CardDescription>
              Create an election that covers an entire state with multiple
              constituencies
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">
              State-level elections allow voters from across the state to
              participate. You'll be able to upload candidate data using a
              spreadsheet template.
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-4">
              <li>Covers all constituencies in a state</li>
              <li>Bulk upload candidates via spreadsheet</li>
              <li>Automated candidate assignment to constituencies</li>
              <li>Centralized result declaration</li>
            </ul>
          </CardContent>
          <CardFooter className="border-t border-border pt-4">
            <Link to="/admin/create-election/state" className="w-full">
              <Button className="w-full">
                <CalendarPlus className="mr-2 h-4 w-4" /> Create State Election
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="bg-primary/5 border-b border-border">
            <CardTitle className="flex items-center">
              <FileSpreadsheet className="mr-2 h-5 w-5" />
              Create Constituency-Level Election
            </CardTitle>
            <CardDescription>
              Create an election for a specific constituency with individual
              candidates
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">
              Constituency-level elections are focused on a specific area.
              You'll add candidates individually with detailed information for
              each.
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-4">
              <li>Targeted to a specific constituency</li>
              <li>Add candidates individually with details</li>
              <li>Upload candidate photos</li>
              <li>Detailed candidate profiles</li>
            </ul>
          </CardContent>
          <CardFooter className="border-t border-border pt-4">
            <Link to="/admin/create-election/constituency" className="w-full">
              <Button className="w-full">
                <MapPin className="mr-2 h-4 w-4" /> Create Constituency Election
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
