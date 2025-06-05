import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Calendar,
  CreditCard,
  Shield,
  Eye,
  Camera,
  FileText,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader } from "@/components/ui/loader";

interface AIVerificationData {
  database_storage: {
    message: string;
    stored: boolean;
  };
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

interface AIVerificationResultsProps {
  verificationData: AIVerificationData | null;
  onProceed: () => void;
  onRetry: () => void;
  isVerifying: boolean;
  mismatches: {
    field: string;
    extracted: string;
    entered: string;
  }[];
}

export function AIVerificationResults({
  verificationData,
  mismatches = [],
  onProceed,
  onRetry,
  isVerifying,
}: AIVerificationResultsProps) {
  const hasErrors =
    !verificationData?.face_verification.verified_by_system ||
    !verificationData?.liveness_check.passed ||
    mismatches.length > 0 ||
    (verificationData?.errors && verificationData?.errors.length > 0);

  const hasWarnings =
    verificationData?.warnings && verificationData?.warnings.length > 0;

  const getOverallConfidence = () => {
    let score = 0;
    let factors = 0;

    if (verificationData?.face_verification.verified_by_system) {
      const distance = Number.parseFloat(
        verificationData?.face_verification.distance
      );
      if (!isNaN(distance)) {
        score += Math.max(0, (0.4 - distance) / 0.4) * 100;
        factors++;
      }
    }

    if (verificationData?.liveness_check.confidence) {
      score += verificationData?.liveness_check.confidence * 100;
      factors++;
    }

    if (verificationData?.text_details.extraction_confidence) {
      score += verificationData?.text_details.extraction_confidence * 100;
      factors++;
    }

    return factors > 0 ? Math.round(score / factors) : 0;
  };

  const confidenceScore = getOverallConfidence();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            AI Verification Results
          </CardTitle>
          <CardDescription>
            Your documents and information have been processed by our AI
            verification system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Status */}
          <Alert
            className={
              hasErrors
                ? "border-destructive bg-destructive/10"
                : hasWarnings
                ? "border-amber-500 bg-amber-50"
                : "border-green-500 bg-green-50"
            }
          >
            {hasErrors ? (
              <XCircle className="h-4 w-4 text-destructive" />
            ) : hasWarnings ? (
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-600" />
            )}
            <AlertTitle>
              {hasErrors
                ? "Verification Failed"
                : hasWarnings
                ? "Verification Passed with Warnings"
                : "Verification Successful"}
            </AlertTitle>
            <AlertDescription>
              {verificationData?.overall_status}
            </AlertDescription>
          </Alert>

          {confidenceScore > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Overall Confidence Score
                </span>
                <span className="text-sm font-bold">
                  {100 - confidenceScore}%
                </span>
              </div>
              <Progress value={100 - confidenceScore} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Based on face verification, liveness detection, and text
                extraction accuracy
              </p>
            </div>
          )}

          {/* Errors Section */}
          {verificationData?.errors && verificationData?.errors.length > 0 && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Issues Found</AlertTitle>
              <AlertDescription>
                <ul className="mt-2 space-y-1">
                  {verificationData?.errors.map((error, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-destructive">•</span>
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {verificationData?.warnings &&
            verificationData?.warnings.length > 0 && (
              <Alert className="border-amber-500 bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <AlertTitle>Warnings</AlertTitle>
                <AlertDescription>
                  <ul className="mt-2 space-y-1">
                    {verificationData?.warnings.map((warning, index) => (
                      <li
                        key={index}
                        className="text-sm flex items-start gap-2"
                      >
                        <span className="text-amber-500">•</span>
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

          {/* Extracted Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Extracted Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Name</span>
                    {verificationData?.text_details.extraction_confidence && (
                      <Badge variant="outline" className="text-xs">
                        {Math.round(
                          verificationData?.text_details.extraction_confidence *
                            100
                        )}
                        % confidence
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm">
                    {verificationData?.text_details.name}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Date of Birth</span>
                  </div>
                  <p className="text-sm">
                    {verificationData?.text_details.dob}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Aadhaar Number</span>
                  </div>
                  <p className="text-sm font-mono">
                    {verificationData?.text_details.aadhaar_no.includes("X")
                      ? verificationData?.text_details.aadhaar_no
                      : verificationData?.text_details.aadhaar_no.replace(
                          /(\d{4})(\d{4})(\d{4})/,
                          "$1 $2 $3"
                        )}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Document Type</span>
                  </div>
                  <p className="text-sm">
                    {verificationData?.text_details.card_type}
                  </p>
                </CardContent>
              </Card>

              {verificationData?.text_details.gender && (
                <Card>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Gender</span>
                    </div>
                    <p className="text-sm">
                      {verificationData?.text_details.gender}
                    </p>
                  </CardContent>
                </Card>
              )}

              {verificationData?.text_details.address && (
                <Card>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Address</span>
                    </div>
                    <p className="text-sm">
                      {verificationData?.text_details.address}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Verification Checks</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Liveness Detection</span>
                  <Badge
                    variant={
                      verificationData?.liveness_check.passed
                        ? "default"
                        : "destructive"
                    }
                  >
                    {verificationData?.liveness_check.status}
                  </Badge>
                  {verificationData?.liveness_check.confidence && (
                    <span className="text-xs text-muted-foreground">
                      {Math.round(
                        verificationData?.liveness_check.confidence * 100
                      )}
                      % confidence
                    </span>
                  )}
                </div>
                {verificationData?.liveness_check.passed ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
              </div>

              {/* Face Verification */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Face Verification</span>
                  <Badge
                    variant={
                      verificationData?.face_verification.verified_by_system
                        ? "default"
                        : "destructive"
                    }
                  >
                    {verificationData?.face_verification.verified_by_system
                      ? "PASSED"
                      : "FAILED"}
                  </Badge>
                </div>
                {verificationData?.face_verification.verified_by_system ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
              </div>

              {/* Document Processing */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Document Processing</span>
                  <Badge
                    variant={
                      verificationData?.id_card_processing_status.includes(
                        "Successfully"
                      )
                        ? "default"
                        : "destructive"
                    }
                  >
                    {verificationData?.id_card_processing_status.includes(
                      "Successfully"
                    )
                      ? "SUCCESS"
                      : "FAILED"}
                  </Badge>
                </div>
                {verificationData?.id_card_processing_status.includes(
                  "Successfully"
                ) ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
              </div>

              {/* Data Matching */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Data Matching</span>
                  <Badge
                    variant={
                      mismatches.length === 0 ? "default" : "destructive"
                    }
                  >
                    {mismatches.length === 0 ? "PASSED" : "FAILED"}
                  </Badge>
                </div>
                {mismatches.length === 0 ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
              </div>
            </div>
          </div>

          {mismatches.length > 0 && (
            <div className="mt-6 p-4 border border-destructive/50 bg-destructive/10 rounded-md">
              <h4 className="text-destructive font-semibold mb-2">
                Mismatches Found
              </h4>
              <ul className="space-y-2">
                {mismatches.map((mismatch, idx) => (
                  <li key={idx} className="text-sm">
                    <span className="font-medium">
                      {mismatch.field === "name"
                        ? "Name"
                        : mismatch.field === "dob"
                        ? "Date of Birth"
                        : "Aadhaar Number"}
                      :
                    </span>
                    <br />
                    <span className="text-muted-foreground">
                      Extracted:
                    </span>{" "}
                    <span className="text-foreground">
                      {mismatch.field === "aadharNumber"
                        ? mismatch.extracted.replace(
                            /(\d{4})(\d{4})(\d{4})/,
                            "$1 $2 $3"
                          )
                        : mismatch.extracted}
                    </span>
                    <br />
                    <span className="text-muted-foreground">Entered:</span>{" "}
                    <span className="text-foreground">
                      {mismatch.field === "aadharNumber"
                        ? mismatch.entered.replace(
                            /(\d{4})(\d{4})(\d{4})/,
                            "$1 $2 $3"
                          )
                        : mismatch.entered}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            {hasErrors ? (
              <Button onClick={onRetry} variant="outline" className="flex-1">
                Retry Verification
              </Button>
            ) : (
              <Button
                onClick={onProceed}
                className="flex-1"
                disabled={isVerifying}
              >
                {isVerifying && (
                  <Loader
                    size="sm"
                    className="border-white border-t-primary/10"
                  />
                )}
                <>
                  {hasWarnings
                    ? "Proceed Despite Warnings"
                    : "Proceed with Verification"}
                </>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
