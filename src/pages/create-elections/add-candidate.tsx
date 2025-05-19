import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Plus, Trash2, Info } from "lucide-react";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { UserSearch } from "@/components/shared/admin/user-search";
import { Loader } from "@/components/ui/loader";
import { useNavigate } from "react-router";

interface UserType {
  id: string;
  name: string;
  walletAddress: string;
  aadhaarNumber: string;
  profileImage?: string;
  status: "pending" | "approved" | "rejected";
  party?: {
    id: string;
    name: string;
    symbol: string;
    status: "pending" | "verified" | "rejected";
  };
  role?: "member" | "leader" | "admin";
  constituency?: string;
  votingHistory?: {
    electionId: string;
    electionName: string;
    votedAt: Date;
  }[];
}

// Candidate schema
const candidateSchema = z.object({
  userId: z.string().min(1, "User selection is required"),
  description: z.string().optional(),
});

// Full election schema with candidates
const electionWithCandidatesSchema = z.object({
  electionDetails: z.any(), // We'll validate this separately
  candidates: z
    .array(candidateSchema)
    .min(1, "At least one candidate is required"),
});

const electionDetailsSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  purpose: z.string().min(10, {
    message: "Purpose must be at least 10 characters.",
  }),
  startDate: z.date({
    required_error: "Start date is required.",
  }),
  endDate: z.date({
    required_error: "End date is required.",
  }),
  state: z.string({
    required_error: "State is required.",
  }),
  district: z.string({
    required_error: "District is required.",
  }),
  constituency: z.string().optional(),
  status: z.string().default("0"), // 0 = Upcoming
});

type ElectionDetailsFormValues = z.infer<typeof electionDetailsSchema>;

export default function CreateConstituencyElectionPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [showPartyRequirement, setShowPartyRequirement] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);
  const [electionDetails, setElectionDetails] =
    useState<ElectionDetailsFormValues | null>(null);
  const navigate = useNavigate();

  const steps = ["Election Details", "Add Candidates", "Review & Confirm"];

  // Form for candidates
  const candidatesForm = useForm<{
    candidates: z.infer<typeof candidateSchema>[];
  }>({
    resolver: zodResolver(
      z.object({
        candidates: z
          .array(candidateSchema)
          .min(1, "At least one candidate is required"),
      })
    ),
    defaultValues: {
      candidates: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: candidatesForm.control,
    name: "candidates",
  });

  // Handle election details submission
  const handleElectionDetailsSubmit = (values: ElectionDetailsFormValues) => {
    setElectionDetails(values);
    nextStep();
  };

  // Handle final form submission
  const handleFinalSubmit = async () => {
    // Validate candidates
    const isValid = await candidatesForm.trigger("candidates");
    if (!isValid || !electionDetails) return;

    setIsSubmitting(true);

    // Combine election details and candidates
    const completeElection = {
      ...electionDetails,
      candidates: candidatesForm.getValues().candidates,
    };

    // Simulate API call to create election
    setTimeout(() => {
      setIsSubmitting(false);
      // toast({
      //   title: "Election Created Successfully",
      //   description: `${electionDetails.title} has been created with ${
      //     candidatesForm.getValues().candidates.length
      //   } candidates.`,
      // });

      // Redirect to admin dashboard
      navigate("/admin");
    }, 2000);
  };

  const nextStep = () => {
    if (currentStep === 1) {
      // Validate candidates before proceeding
      const isValid = candidatesForm.trigger("candidates");
      if (!isValid) return;

      if (fields.length === 0) {
        // toast({
        //   title: "Candidates Required",
        //   description: "Please add at least one candidate to continue.",
        //   variant: "destructive",
        // });
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleAddCandidate = () => {
    setShowUserSearch(true);
  };

  const handleUserSelect = (user: UserType) => {
    // Check if user has a party affiliation
    if (!user.party) {
      setShowPartyRequirement(true);
      return;
    }

    // Check if user is already added
    if (selectedUsers.some((selectedUser) => selectedUser.id === user.id)) {
      // toast({
      //   title: "User Already Added",
      //   description: "This user is already added as a candidate.",
      //   variant: "destructive",
      // });
      return;
    }

    // Add user to selected users
    setSelectedUsers((prev) => [...prev, user]);

    // Add user to form candidates
    append({
      userId: user.id,
      description: "",
    });

    setShowUserSearch(false);

    // toast({
    //   title: "Candidate Added",
    //   description: `${user.name} has been added as a candidate.`,
    // });
  };

  const removeCandidate = (index: number) => {
    // Remove from form
    remove(index);

    // Remove from selected users
    setSelectedUsers((prev) => prev.filter((_, i) => i !== index));
  };

  // Get user details by ID
  const getUserById = (userId: string) => {
    return selectedUsers.find((user) => user.id === userId);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">
        Create Constituency-Level Election
      </h1>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>{steps[currentStep]}</CardTitle>
          <CardDescription>
            {currentStep === 0 &&
              "Fill in the details to create a new constituency-level election"}
            {currentStep === 1 &&
              "Add candidates who will participate in this election"}
            {currentStep === 2 &&
              "Review all details before creating the election"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Step 2: Add Candidates */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Candidates</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddCandidate}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Candidate
                </Button>
              </div>

              <Alert
                variant="default"
                className="bg-blue-50 text-blue-800 border-blue-200"
              >
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Only users with party affiliations can be added as candidates.
                  Each candidate must be a member of a registered political
                  party.
                </AlertDescription>
              </Alert>

              <Form {...candidatesForm}>
                <form className="space-y-4">
                  <FormField
                    control={candidatesForm.control}
                    name="candidates"
                    render={() => (
                      <FormItem>
                        <div className="space-y-4">
                          {fields.length === 0 ? (
                            <div className="text-center p-8 border border-dashed rounded-md">
                              <p className="text-muted-foreground">
                                No candidates added yet. Click "Add Candidate"
                                to search for users.
                              </p>
                            </div>
                          ) : (
                            fields.map((field, index) => {
                              const user = getUserById(field.userId as string);
                              if (!user) return null;

                              return (
                                <Card key={field.id} className="p-4 relative">
                                  <div className="absolute top-4 right-4">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeCandidate(index)}
                                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>

                                  <div className="flex items-start gap-4">
                                    <Avatar className="h-16 w-16">
                                      {user.profileImage ? (
                                        <AvatarImage
                                          src={
                                            user.profileImage ||
                                            "/placeholder.svg"
                                          }
                                          alt={user.name}
                                        />
                                      ) : (
                                        <AvatarFallback>
                                          <User className="h-8 w-8" />
                                        </AvatarFallback>
                                      )}
                                    </Avatar>

                                    <div className="flex-1">
                                      <h3 className="font-medium text-lg">
                                        {user.name}
                                      </h3>
                                      <p className="text-sm text-muted-foreground">
                                        {user.walletAddress}
                                      </p>

                                      {user.party && (
                                        <div className="flex items-center mt-2">
                                          <Badge
                                            variant="outline"
                                            className="px-3 py-1"
                                          >
                                            <span className="mr-1 text-lg">
                                              {user.party.symbol}
                                            </span>
                                            {user.party.name}
                                          </Badge>
                                          {user.party.status === "verified" && (
                                            <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">
                                              Verified
                                            </Badge>
                                          )}
                                        </div>
                                      )}

                                      <div className="mt-4">
                                        <FormField
                                          control={candidatesForm.control}
                                          name={`candidates.${index}.description`}
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>
                                                Candidate Description
                                              </FormLabel>
                                              <FormControl>
                                                <Textarea
                                                  placeholder="Add a brief description or manifesto for this candidate..."
                                                  className="min-h-[80px]"
                                                  {...field}
                                                />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </Card>
                              );
                            })
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>
          )}

          {/* Step 3: Review & Confirm */}
          {currentStep === 2 && electionDetails && (
            <div className="space-y-6">
              <Tabs defaultValue="election" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="election">Election Details</TabsTrigger>
                  <TabsTrigger value="candidates">
                    Candidates ({fields.length})
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="election" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-1">
                        Title
                      </h3>
                      <p className="text-base">{electionDetails.title}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-1">
                        Status
                      </h3>
                      <p className="text-base">
                        {electionDetails.status === "0"
                          ? "Upcoming"
                          : "Ongoing"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">
                      Purpose
                    </h3>
                    <p className="text-base">{electionDetails.purpose}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-1">
                        Start Date & Time
                      </h3>
                      <p className="text-base">
                        {electionDetails.startDate
                          ? new Date(electionDetails.startDate).toLocaleString()
                          : "Not set"}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-1">
                        End Date & Time
                      </h3>
                      <p className="text-base">
                        {electionDetails.endDate
                          ? new Date(electionDetails.endDate).toLocaleString()
                          : "Not set"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-1">
                        State
                      </h3>
                      <p className="text-base">{electionDetails.state}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-1">
                        District
                      </h3>
                      <p className="text-base">{electionDetails.district}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-1">
                        Constituency
                      </h3>
                      <p className="text-base">
                        {electionDetails.constituency}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="candidates" className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {fields.map((field, index) => {
                      const user = getUserById(field.userId as string);
                      if (!user) return null;

                      return (
                        <Card key={field.id} className="overflow-hidden">
                          <div className="aspect-square relative bg-muted">
                            {user.profileImage ? (
                              <img
                                src={user.profileImage || "/placeholder.svg"}
                                alt={user.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <User className="h-16 w-16 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-medium text-lg">{user.name}</h3>
                            {user.party && (
                              <div className="flex items-center mt-1 mb-2">
                                <Badge variant="outline" className="px-2 py-1">
                                  <span className="mr-1 text-lg">
                                    {user.party.symbol}
                                  </span>
                                  {user.party.name}
                                </Badge>
                              </div>
                            )}
                            {candidatesForm.getValues(
                              `candidates.${index}.description`
                            ) && (
                              <p className="text-sm mt-2 line-clamp-3">
                                {candidatesForm.getValues(
                                  `candidates.${index}.description`
                                )}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
        {currentStep > 0 && (
          <CardFooter className="flex justify-between border-t p-6">
            <Button type="button" variant="outline" onClick={prevStep}>
              <ChevronLeft className="h-4 w-4 mr-2" /> Back
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button type="button" onClick={nextStep}>
                Continue <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader size="sm" className="mr-2" /> Creating Election...
                  </>
                ) : (
                  "Create Election"
                )}
              </Button>
            )}
          </CardFooter>
        )}
      </Card>

      {/* User Search Dialog */}
      <Dialog open={showUserSearch} onOpenChange={setShowUserSearch}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add Candidate</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <UserSearch onUserSelect={handleUserSelect} showPartyInfo={true} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Party Requirement Dialog */}
      <Dialog
        open={showPartyRequirement}
        onOpenChange={setShowPartyRequirement}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Party Affiliation Required</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Alert variant="destructive">
              <AlertDescription>
                Only users with party affiliations can be added as candidates.
                The selected user is not affiliated with any political party.
              </AlertDescription>
            </Alert>
            <p className="mt-4 text-muted-foreground">
              Please select a different user who is a member of a registered
              political party, or have this user join a party before adding them
              as a candidate.
            </p>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setShowPartyRequirement(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
