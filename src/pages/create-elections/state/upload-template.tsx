import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AdminBreadcrumb } from "@/components/ui/admin-breadcrumb";
import { ProgressSteps } from "@/components/ui/progress-steps";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Download, FileSpreadsheet, Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader } from "@/components/ui/loader";

export default function UploadTemplatePage() {
  const navigate = useNavigate();
  const [electionData, setElectionData] = useState<unknown>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem("stateElectionData");
    if (!storedData) {
      //   toast({
      //     title: "No Election Data",
      //     description: "Please start the election creation process from the beginning.",
      //     variant: "destructive",
      //   })
      navigate("/admin/create-election");
      return;
    }

    setElectionData(JSON.parse(storedData));
  }, [navigate]);

  const handleDownloadTemplate = () => {
    // In a real app, this would generate and download an Excel template
    // For this demo, we'll just show a toast
    // toast({
    //   title: "Template Downloaded",
    //   description: "The candidate template has been downloaded to your device.",
    // })
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (
        droppedFile.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        droppedFile.type === "application/vnd.ms-excel"
      ) {
        setFile(droppedFile);
      } else {
        // toast({
        //   title: "Invalid File Type",
        //   description: "Please upload an Excel file (.xlsx or .xls)",
        //   variant: "destructive",
        // })
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) {
      //   toast({
      //     title: "No File Selected",
      //     description: "Please select a file to upload.",
      //     variant: "destructive",
      //   })
      return;
    }

    setIsUploading(true);

    // Simulate file upload and processing
    setTimeout(() => {
      setIsUploading(false);

      // Store confirmation in localStorage
      localStorage.setItem("templateUploaded", "true");

      //   toast({
      //     title: "Template Uploaded Successfully",
      //     description: "Your candidate data has been processed.",
      //   })

      // Navigate to confirmation page
      navigate("/admin/create-election/state/confirmation");
    }, 2000);
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
          { label: "Upload Template" },
        ]}
      />
      <h1 className="text-3xl font-bold mb-4">Upload Candidate Template</h1>

      <ProgressSteps
        steps={["Election Details", "Upload Template", "Confirmation"]}
        currentStep={1}
      />

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Upload Candidate Data</CardTitle>
          <CardDescription>
            Download the template, fill in candidate details, and upload the
            completed file
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              The template contains columns for Candidate Name, Party,
              Constituency, and Image URL. Please fill all required fields for
              each candidate.
            </AlertDescription>
          </Alert>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-medium mb-2">
                Step 1: Download Template
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Download the Excel template and fill in the candidate details
                according to the instructions.
              </p>
            </div>
            <Button onClick={handleDownloadTemplate} className="md:self-end">
              <Download className="mr-2 h-4 w-4" /> Download Template
            </Button>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-2">
              Step 2: Upload Completed Template
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload the completed Excel file with candidate information.
            </p>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/30"
              } transition-colors`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="flex flex-col items-center">
                  <FileSpreadsheet className="h-12 w-12 text-primary mb-4" />
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB • {file.type}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setFile(null)}
                  >
                    Remove File
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="font-medium">
                    Drag and drop your Excel file here
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    or click to browse files
                  </p>
                  <label className="cursor-pointer">
                    <Button variant="outline">Select File</Button>
                    <input
                      type="file"
                      className="hidden"
                      accept=".xlsx,.xls"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/create-election/state")}
            >
              Back
            </Button>
            <Button onClick={handleUpload} disabled={!file || isUploading}>
              {isUploading ? (
                <>
                  <Loader size="sm" className="mr-2" /> Processing...
                </>
              ) : (
                "Upload and Continue"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
