import React from "react";
import {
  FormField,
  FormItem,
  FormMessage,
  FormControl,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { CalendarIcon, Camera, HelpCircle } from "lucide-react";
import { CameraGuidelines } from "./camera-guidelines";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CameraCapture } from "../camera-capture";
import * as z from "zod";
import { UseFormReturn } from "react-hook-form";
import { updateUserSchema } from "@/validations";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
const PersonalInfo = ({
  isCameraSupported,
  mismatches,
  form,
}: {
  isCameraSupported: boolean;
  mismatches: {
    field: string;
    extracted: string;
    entered: string;
  }[];
  form: UseFormReturn<z.infer<typeof updateUserSchema>>;
}) => {
  const [showPhotoGuidelines, setShowPhotoGuidelines] = React.useState(false);
  const [showCamera, setShowCamera] = React.useState(false);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);

  const handleCameraCapture = (imageSrc: string) => {
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "profile-photo.png", {
          type: "image/png",
        });
        form.setValue("profileImage", file);
        setImagePreview(imageSrc);
        setShowCamera(false);
      });
  };
  const getMismatch = (fieldName: string) => {
    console.log(mismatches);
    return mismatches.find(
      (m) => m.field.toLowerCase() === fieldName.toLowerCase()
    );
  };

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => {
              const mismatch = getMismatch("name");
              console.log("mismatch", mismatch);
              return (
                <FormItem>
                  <FormLabel className="text-foreground">First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John"
                      {...field}
                      className={cn(
                        "bg-background",
                        mismatch && "border-destructive text-destructive"
                      )}
                    />
                  </FormControl>
                  {mismatch && (
                    <p className="text-sm text-destructive">
                      Mismatch: Entered "{mismatch.entered}", Extracted "
                      {mismatch.extracted}"
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => {
              const mismatch = getMismatch("name");
              return (
                <FormItem>
                  <FormLabel className="text-foreground">Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Doe"
                      {...field}
                      className={cn(
                        "bg-background",
                        mismatch && "border-destructive text-destructive"
                      )}
                    />
                  </FormControl>
                  {mismatch && (
                    <p className="text-sm text-destructive">
                      Mismatch: Entered "{mismatch.entered}", Extracted "
                      {mismatch.extracted}"
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="aadharNumber"
            render={({ field }) => {
              const mismatch = getMismatch("aadharNumber");
              return (
                <FormItem>
                  <FormLabel className="text-foreground">
                    Aadhaar Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123456789012"
                      {...field}
                      className={cn(
                        "bg-background",
                        mismatch && "border-destructive text-destructive"
                      )}
                    />
                  </FormControl>
                  {mismatch && (
                    <p className="text-sm text-destructive">
                      Mismatch: Entered "{mismatch.entered}", Extracted "
                      {mismatch.extracted}"
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => {
              const mismatch = mismatches.find((m) => m.field === "dob");

              return (
                <FormItem>
                  <FormLabel className="text-foreground">
                    Date of Birth
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                            mismatch && "border-destructive text-destructive"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        captionLayout="dropdown-buttons"
                        selected={field.value}
                        onSelect={field.onChange}
                        fromYear={1960}
                        toYear={new Date().getFullYear()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {mismatch && (
                    <p className="text-sm text-destructive">
                      Mismatch: Entered "{mismatch.entered}", Extracted "
                      {mismatch.extracted}"
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="9876543210"
                    {...field}
                    className="bg-background"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="john.doe@example.com"
                    {...field}
                    className="bg-background"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="profileImage"
          render={() => (
            <FormItem>
              <FormLabel className={"text-foreground"}>
                Profile Picture{" "}
              </FormLabel>
              <FormControl>
                <div className="flex flex-col items-center">
                  {imagePreview ? (
                    <div className="mb-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-full border"
                      />
                    </div>
                  ) : null}
                  <Collapsible
                    open={showPhotoGuidelines}
                    onOpenChange={setShowPhotoGuidelines}
                    className="w-full mb-1"
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mb-2"
                      >
                        <HelpCircle className="h-4 w-4 mr-2" />
                        {showPhotoGuidelines ? "Hide" : "Show"} Photo Guidelines
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CameraGuidelines type="profile" />
                    </CollapsibleContent>
                  </Collapsible>
                  <div className="flex flex-col items-center justify-center w-full">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {isCameraSupported && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowCamera(true)}
                          className="flex items-center"
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          Take Photo
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </FormControl>
              <FormDescription>
                This image will be used as your profile picture on the platform.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <Dialog open={showCamera} onOpenChange={setShowCamera}>
        <DialogTitle className="sr-only">Capture Profile Image</DialogTitle>
        <DialogContent className="p-0 max-w-md overflow-hidden">
          <CameraCapture
            onCapture={handleCameraCapture}
            onClose={() => setShowCamera(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PersonalInfo;
