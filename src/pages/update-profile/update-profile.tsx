import * as z from "zod";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { useWallet } from "@/store/useWallet";
import { updateUserSchema } from "@/validations";
import { toast } from "sonner";
import {
  useModelMutation,
  useUpdateProfileMutation,
} from "@/hooks/use-location";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import PersonalInfo from "@/components/shared/update-profile/personal-info";
import VotingDetails from "@/components/shared/update-profile/voting-details";
import { AIVerificationResults } from "@/components/shared/update-profile/ai-verification-results";
import { checkMismatches } from "@/utils/checkMismatches";

interface AIVerificationData {
  database_storage: { message: string; stored: boolean };
  face_verification: {
    distance: string;
    message: string;
    metric: string;
    model: string;
    status: string;
    system_threshold_used: string;
    verified_by_system: boolean;
    deepface_verified_flag: boolean;
  };
  id_card_processing_status: string;
  liveness_check: {
    passed: boolean;
    status: string;
    confidence?: number;
    details?: string;
  };
  overall_status: string;
  text_details: {
    aadhaar_no: string;
    card_type: string;
    dob: string;
    name: string;
    address?: string;
    gender?: string;
    extraction_confidence?: number;
  };
  errors?: string[];
  warnings?: string[];
}

interface MismatchType {
  field: string;
  extracted: string;
  entered: string;
}

export default function UpdateProfile() {
  const [activeTab, setActiveTab] = React.useState("personal");
  const { walletAddress } = useWallet();
  const [isCameraSupported, setIsCameraSupported] = React.useState(true);
  const [aiVerificationData, setAIVerificationData] =
    React.useState<AIVerificationData | null>(null);
  const [showAIResults, setShowAIResults] = React.useState(false);
  const [isResubmitMode, setIsResubmitMode] = React.useState(false);
  const [mismatches, setMismatches] = React.useState<MismatchType[]>([]);

  const { mutate: updateProfile, isPending: isVerifying } =
    useUpdateProfileMutation();
  const { mutate: verifyUserData, isPending: isProcessingAI } =
    useModelMutation();

  React.useEffect(() => {
    if (
      typeof navigator !== "undefined" &&
      !navigator.mediaDevices?.getUserMedia
    ) {
      setIsCameraSupported(false);
    }
  }, []);

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      state: { id: "", name: "" },
      district: { id: "", name: "" },
      mandal: { id: "", name: "" },
      constituency: { id: "", name: "" },
    },
  });

  const onSubmit = async (values: z.infer<typeof updateUserSchema>) => {
    if (!walletAddress) {
      toast.message("Wallet not connected", {
        description: "Please connect your MetaMask wallet first",
      });
      return;
    }

    const formData = new FormData();
    formData.append("id_card_image", values.aadharImage);
    formData.append("live_face_image", values.profileImage);

    verifyUserData(formData, {
      onSuccess: (response) => {
        const { data, status } = response;

        console.log("AI Verification response:", response);
        const formValues = form.getValues();
        const mismatchResult = checkMismatches(data, {
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          aadharNumber: formValues.aadharNumber,
          dob: formValues.dob,
        });

        if (status === 200) {
          setAIVerificationData(data);
          setMismatches(mismatchResult);
          setShowAIResults(true);
        } else {
          setMismatches(mismatchResult);
          setAIVerificationData(data);
          setShowAIResults(true);

          toast.error("AI verification failed.", {
            description: data?.overall_status || "Verification did not pass.",
          });
        }
      },
      onError: (err) => {
        console.error("Unexpected AI verification error:", err);
        toast.error("Something went wrong.", {
          description: "Unable to process the verification.",
        });
      },
    });
  };

  const handleFinalVerification = () => {
    const formData = new FormData();
    const formValues = form.getValues();

    formData.append("firstName", formValues.firstName);
    formData.append("lastName", formValues.lastName);
    formData.append("email", formValues.email);
    const format = formValues.dob
      ? new Date(formValues.dob).toISOString().split("T")[0]
      : "";
    formData.append("dob", format);
    formData.append("aadharNumber", formValues.aadharNumber);
    formData.append("aadharImage", formValues.aadharImage);
    formData.append("profileImage", formValues.profileImage);
    formData.append("stateId", formValues.state.id);
    formData.append("districtId", formValues.district?.id || "");
    formData.append("mandalId", formValues.mandal?.id || "");
    formData.append("constituencyId", formValues.constituency?.id || "");
    formData.append("phoneNumber", formValues.phoneNumber);

    updateProfile(formData);
  };

  const handleRetryVerification = () => {
    setIsResubmitMode(true);
    setShowAIResults(false);
    setAIVerificationData(null);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>
            {isResubmitMode
              ? "Update Rejected Information"
              : "Update Your Profile"}
          </CardTitle>
          <CardDescription>
            {isResubmitMode
              ? "Please update only the information that needs correction"
              : "Complete your profile information for verification"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isResubmitMode && (
            <Alert className="mb-6">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Fields that need attention are highlighted. Other fields are
                pre-filled with your existing information.
              </AlertDescription>
            </Alert>
          )}

          {!isResubmitMode && (
            <Alert className="mb-6 border-amber-500/50 bg-amber-500/10">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertDescription className="text-amber-500">
                Your information must match your Aadhaar for identity
                verification. This includes your location details for voting
                eligibility.
              </AlertDescription>
            </Alert>
          )}

          {isProcessingAI ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader size="lg" text="Processing with AI..." />
              <p className="mt-4 text-center text-muted-foreground">
                Our AI system is extracting and verifying information from your
                Aadhaar card and profile photo.
              </p>
            </div>
          ) : showAIResults ? (
            <AIVerificationResults
              verificationData={aiVerificationData}
              mismatches={mismatches}
              onProceed={handleFinalVerification}
              onRetry={handleRetryVerification}
              isVerifying={isVerifying}
            />
          ) : isVerifying ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader size="lg" text="Finalizing verification..." />
              <p className="mt-4 text-center text-muted-foreground">
                Please wait while we complete your profile registration.
              </p>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="personal" className="relative">
                      Personal Information
                    </TabsTrigger>
                    <TabsTrigger value="verification" className="relative">
                      Verification Details
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="personal" className="mt-2">
                    <PersonalInfo
                      form={form}
                      mismatches={mismatches}
                      isCameraSupported={isCameraSupported}
                    />
                    <Button
                      onClick={() => setActiveTab("verification")}
                      className="w-full mt-6"
                    >
                      Next
                    </Button>
                  </TabsContent>
                  <TabsContent value="verification" className="mt-2">
                    <VotingDetails form={form} />
                    <Button
                      type="submit"
                      className="w-full mt-6"
                      disabled={activeTab === "personal"}
                    >
                      Verify
                    </Button>
                  </TabsContent>
                </Tabs>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
