import { useEffect, useState } from "react";
import { AdminBreadcrumb } from "@/components/ui/admin-breadcrumb";
import { ProgressSteps } from "@/components/ui/progress-steps";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle, ChevronRight, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { Loader } from "@/components/ui/loader";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router";

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const [electionData, setElectionData] = useState<unknown>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Retrieve election data from localStorage
    const storedData = localStorage.getItem("stateElectionData");
    const templateUploaded = localStorage.getItem("templateUploaded");

    if (!storedData || !templateUploaded) {
      //   toast({
      //     title: "Incomplete Process",
      //     description: "Please complete all steps of the election creation process.",
      //     variant: "destructive",
      //   })
      navigate("/admin/create-election");
      return;
    }

    setElectionData(JSON.parse(storedData));
  }, [navigate, toast]);

  const handleSubmit = () => {
    setIsSubmitting(true);

    // Simulate API call to create election
    setTimeout(() => {
      setIsSubmitting(false);

      // Clear localStorage
      localStorage.removeItem("stateElectionData");
      localStorage.removeItem("templateUploaded");

      //   toast({
      //     title: "Election Created Successfully",
      //     description: "Your state-level election has been created and candidates have been added.",
      //   })

      // Navigate to admin dashboard
      navigate("/admin");
    }, 2000);
  };

  // Helper function to render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "0":
        return (
          <Badge
            variant="outline"
            className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200"
          >
            <Clock className="h-3 w-3 mr-1" />
            Upcoming
          </Badge>
        );
      case "1":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Ongoing
          </Badge>
        );
      default:
        return null;
    }
  };

  if (!electionData) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader size="lg" text="Loading election data..." />
      </div>
    );
  }

  return (
    <div>
      <AdminBreadcrumb
        items={[
          { label: "Create Election", href: "/admin/create-election" },
          { label: "State Election", href: "/admin/create-election/state" },
          {
            label: "Upload Template",
            href: "/admin/create-election/state/upload-template",
          },
          { label: "Confirmation" },
        ]}
      />
      <h1 className="text-3xl font-bold mb-4">Confirm Election Details</h1>

      <ProgressSteps
        steps={["Election Details", "Upload Template", "Confirmation"]}
        currentStep={2}
      />

      <Card className="max-w-4xl mb-6">
        <CardHeader className="bg-primary/5 border-b border-border">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{electionData.title}</CardTitle>
              <CardDescription className="mt-1">
                {electionData.purpose}
              </CardDescription>
            </div>
            <div>{renderStatusBadge(electionData.status)}</div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Election Period
                </h3>
                <p>
                  {format(new Date(electionData.startDate), "MMM d, yyyy")} -{" "}
                  {format(new Date(electionData.endDate), "MMM d, yyyy")}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  State
                </h3>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{electionData.state}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Candidate Summary
              </h3>
              <div className="bg-muted/30 p-4 rounded-md">
                <div className="flex items-center justify-between">
                  <span>Candidates uploaded from template:</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span>Constituencies covered:</span>
                  <span className="font-medium">8</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t border-border pt-4 flex justify-between">
          <Button
            variant="outline"
            onClick={() =>
              router.push("/admin/create-election/state/upload-template")
            }
          >
            Back
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader size="sm" className="mr-2" /> Creating Election...
              </>
            ) : (
              <>
                Create Election <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What Happens Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4 list-decimal list-inside">
            <li className="pl-2">
              <span className="font-medium">Election Creation:</span> The
              election will be created with all the details you provided.
            </li>
            <li className="pl-2">
              <span className="font-medium">Candidate Processing:</span>{" "}
              Candidates from your template will be processed and added to the
              election.
            </li>
            <li className="pl-2">
              <span className="font-medium">Constituency Assignment:</span>{" "}
              Candidates will be assigned to their respective constituencies.
            </li>
            <li className="pl-2">
              <span className="font-medium">Notification:</span> Eligible voters
              will be notified about the upcoming election.
            </li>
            <li className="pl-2">
              <span className="font-medium">Activation:</span> The election will
              be activated on the start date you specified.
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
