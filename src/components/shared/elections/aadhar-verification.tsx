import { DialogFooter } from "@/components/ui/dialog";
import type React from "react";
import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, Camera, Info, AlertTriangle, Upload } from "lucide-react";
import { Loader } from "@/components/ui/loader";
import { CameraCapture } from "@/components/shared/camera-capture";
import { toast } from "sonner";

interface AadhaarVerificationProps {
  isOpen: boolean;
  onClose: () => void;
  onVerificationSuccess: () => void;
  verificationAttempts: number;
  maxAttempts: number;
  onAttemptIncrement: () => void;
}

export function AadhaarVerification({
  isOpen,
  onClose,
  onVerificationSuccess,
  verificationAttempts,
  maxAttempts,
  onAttemptIncrement,
}: AadhaarVerificationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [aadhaarImage, setAadhaarImage] = useState<string | null>(null);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const handleAadhaarUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAadhaarImage(reader.result as string);
          setCurrentStep(2);
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const handleSelfieCapture = useCallback(
    (imageSrc: string) => {
      setSelfieImage(imageSrc);
      setShowCamera(false);
      setCurrentStep(3);
      setIsVerifying(true);

      // Simulate AI verification process
      setTimeout(() => {
        // Simulate verification result (90% success rate for demo)
        const isVerified = Math.random() > 0.1;

        if (isVerified) {
          setIsVerifying(false);
          onVerificationSuccess();
          toast.success("Verification Successful", {
            description:
              "Your identity has been verified. You can now proceed to vote.",
          });
        } else {
          setIsVerifying(false);
          onAttemptIncrement();

          if (verificationAttempts + 1 >= maxAttempts) {
            toast.error("Verification Failed", {
              description:
                "Maximum verification attempts reached. Please contact support.",
            });
            onClose();
          } else {
            toast.error("Verification Failed", {
              description: `Identity verification failed. Please try again. ${
                maxAttempts - (verificationAttempts + 1)
              } attempts remaining.`,
            });
            setCurrentStep(1); // Go back to Aadhaar upload
            setAadhaarImage(null);
            setSelfieImage(null);
          }
        }
      }, 3000);
    },
    [
      verificationAttempts,
      maxAttempts,
      onVerificationSuccess,
      onAttemptIncrement,
      onClose,
    ]
  );

  const retryVerification = useCallback(() => {
    setAadhaarImage(null);
    setSelfieImage(null);
    setCurrentStep(1);
  }, []);

  const skipVerification = useCallback(() => {
    onVerificationSuccess();
    toast.info("Verification Skipped", {
      description: "Proceeding without verification (Demo mode only).",
    });
  }, [onVerificationSuccess]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Identity Verification Required</DialogTitle>
            <DialogDescription>
              Please verify your identity using your Aadhaar card and a selfie
              before voting
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Step {currentStep} of 3
            </p>

            {currentStep === 1 && (
              <div className="text-center space-y-4">
                <div className="p-6 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-medium mb-2">Aadhaar Card Upload</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Please upload a clear photo of your Aadhaar card showing
                    both front and back sides. Ensure both sides are clearly
                    visible and readable. Good lighting and a flat surface are
                    recommended.
                  </p>
                  <input
                    type="file"
                    id="aadhaar-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAadhaarUpload}
                  />
                  <Button className="w-full" asChild>
                    <label
                      htmlFor="aadhaar-upload"
                      className="flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Upload Aadhaar Card</span>
                    </label>
                  </Button>
                </div>

                <Alert className="text-left">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Why do we need this?</AlertTitle>
                  <AlertDescription>
                    This additional verification ensures that only the
                    registered voter can cast their vote, maintaining the
                    integrity of the election process.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {currentStep === 2 && (
              <div className="text-center space-y-4">
                {aadhaarImage && (
                  <div className="relative">
                    <img
                      src={aadhaarImage || "/placeholder.svg"}
                      alt="Uploaded Aadhaar"
                      className="w-full max-w-sm mx-auto rounded-lg border"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Uploaded Aadhaar Card
                    </p>
                  </div>
                )}

                <div className="p-6 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                  <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-medium mb-2">Selfie Capture</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Now, please capture a real-time selfie. Ensure your face is
                    clearly visible in good lighting.
                  </p>
                  <Button
                    onClick={() => setShowCamera(true)}
                    className="w-full"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Capture Selfie
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 3 ? (
              isVerifying ? (
                <div className="text-center py-8">
                  <Loader size="lg" text="Verifying your identity..." />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Please wait while we verify your Aadhaar card and selfie
                    using AI technology.
                  </p>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  {aadhaarImage && (
                    <div className="relative">
                      <img
                        src={aadhaarImage || "/placeholder.svg"}
                        alt="Uploaded Aadhaar"
                        className="w-full max-w-sm mx-auto rounded-lg border"
                      />
                      <p className="text-sm text-muted-foreground mt-2">
                        Uploaded Aadhaar Card
                      </p>
                    </div>
                  )}

                  {selfieImage && (
                    <div className="relative">
                      <img
                        src={selfieImage || "/placeholder.svg"}
                        alt="Captured Selfie"
                        className="w-full max-w-sm mx-auto rounded-lg border"
                      />
                      <p className="text-sm text-muted-foreground mt-2">
                        Captured Selfie
                      </p>
                    </div>
                  )}

                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Verification Failed</AlertTitle>
                    <AlertDescription>
                      The captured images could not be verified. Please ensure
                      your Aadhaar card is clearly visible and your selfie is
                      clear and try again.
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={retryVerification}
                      className="flex-1"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Try Again
                    </Button>
                    {verificationAttempts >= maxAttempts - 1 && (
                      <Button
                        variant="ghost"
                        onClick={onClose}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              )
            ) : null}
          </div>

          <DialogFooter>
            <div className="flex justify-between w-full">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="outline" onClick={skipVerification} size="sm">
                Skip (Demo)
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCamera} onOpenChange={setShowCamera}>
        <DialogContent className="p-0 max-w-md overflow-hidden">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>Capture Selfie</DialogTitle>
            <DialogDescription>
              Position your face clearly in the frame and capture
            </DialogDescription>
          </DialogHeader>
          <CameraCapture
            onCapture={handleSelfieCapture}
            onClose={() => setShowCamera(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
