import React from "react";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AlertTriangle, Info, Camera, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useWallet } from "@/store/useWallet";
import { useNavigate } from "react-router";
import { Loader } from "@/components/ui/loader";

// List of Indian states
const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

// Sample districts by state (simplified for demo)
const DISTRICTS_BY_STATE: Record<string, string[]> = {
  "Andhra Pradesh": [
    "Anantapur",
    "Chittoor",
    "East Godavari",
    "Guntur",
    "Krishna",
    "Kurnool",
    "Prakasam",
    "Srikakulam",
    "Visakhapatnam",
    "Vizianagaram",
    "West Godavari",
    "YSR Kadapa",
  ],
  Delhi: [
    "Central Delhi",
    "East Delhi",
    "New Delhi",
    "North Delhi",
    "North East Delhi",
    "North West Delhi",
    "Shahdara",
    "South Delhi",
    "South East Delhi",
    "South West Delhi",
    "West Delhi",
  ],
  Maharashtra: [
    "Ahmednagar",
    "Akola",
    "Amravati",
    "Aurangabad",
    "Beed",
    "Bhandara",
    "Buldhana",
    "Chandrapur",
    "Dhule",
    "Gadchiroli",
    "Gondia",
    "Hingoli",
    "Jalgaon",
    "Jalna",
    "Kolhapur",
    "Latur",
    "Mumbai City",
    "Mumbai Suburban",
    "Nagpur",
    "Nanded",
    "Nandurbar",
    "Nashik",
    "Osmanabad",
    "Palghar",
    "Parbhani",
    "Pune",
    "Raigad",
    "Ratnagiri",
    "Sangli",
    "Satara",
    "Sindhudurg",
    "Solapur",
    "Thane",
    "Wardha",
    "Washim",
    "Yavatmal",
  ],
  // Add more states and districts as needed
};

// Sample constituencies by district (simplified for demo)
const CONSTITUENCIES_BY_DISTRICT: Record<string, string[]> = {
  "Mumbai City": [
    "Colaba",
    "Mumbadevi",
    "Worli",
    "Byculla",
    "Malabar Hill",
    "Mahim",
  ],
  Pune: [
    "Pune Cantonment",
    "Kasba Peth",
    "Kothrud",
    "Parvati",
    "Hadapsar",
    "Shivajinagar",
  ],
  "Central Delhi": ["Chandni Chowk", "Matia Mahal", "Ballimaran", "Karol Bagh"],
  // Add more districts and constituencies as needed
};

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  phone: z
    .string()
    .min(10, {
      message: "Phone number must be at least 10 digits.",
    })
    .regex(/^\d+$/, {
      message: "Phone number must contain only digits.",
    }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  pincode: z
    .string()
    .min(6, {
      message: "Pincode must be 6 digits.",
    })
    .max(6, {
      message: "Pincode must be 6 digits.",
    })
    .regex(/^\d+$/, {
      message: "Pincode must contain only digits.",
    }),
  state: z.string({
    required_error: "Please select a state.",
  }),
  district: z.string({
    required_error: "Please select a district.",
  }),
  constituency: z.string({
    required_error: "Please select a constituency.",
  }),
  profileImage: z
    .instanceof(File)
    .optional()
    .or(z.literal(undefined))
    .or(z.string()),
  aadhaarImage: z
    .instanceof(File)
    .optional()
    .or(z.literal(undefined))
    .or(z.string()),
});

export default function UpdateProfile() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const [aadhaarImagePreview, setAadhaarImagePreview] = useState<string | null>(
    null
  );
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [availableConstituencies, setAvailableConstituencies] = useState<
    string[]
  >([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingConstituencies, setLoadingConstituencies] = useState(false);
  const [isResubmitMode, setIsResubmitMode] = useState(false);
  const [rejectedFields, setRejectedFields] = useState<string[]>([]);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [showCamera, setShowCamera] = useState(false);
  const [showAadhaarCamera, setShowAadhaarCamera] = useState(false);
  const [isCameraSupported, setIsCameraSupported] = useState(true);
  const { wallet, setIsProfileComplete } = useWallet();
  const navigate = useNavigate();

  // Check if camera is supported
  useEffect(() => {
    if (
      typeof navigator !== "undefined" &&
      !navigator.mediaDevices?.getUserMedia
    ) {
      setIsCameraSupported(false);
    }
  }, []);

  // Mock user data - in a real app, this would be fetched from an API
  const existingUserData = {
    firstName: "John",
    lastName: "Doe",
    phone: "9876543210",
    email: "john.doe@example.com",
    pincode: "400001",
    state: "Maharashtra",
    district: "Mumbai City",
    constituency: "Worli",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      pincode: "",
      state: "",
      district: "",
      constituency: "",
    },
  });

  // Check for resubmit mode and rejected fields from URL params
  // Check for resubmit mode and rejected fields from URL params
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const mode = searchParams.get("mode");
    if (mode === "resubmit") {
      setIsResubmitMode(true);

      const fields = searchParams.get("fields");
      if (fields) {
        setRejectedFields(fields.split(","));
      }

      const reason = searchParams.get("reason");
      if (reason) {
        setRejectionReason(decodeURIComponent(reason));
      }

      // Set active tab based on rejected fields
      if (fields?.includes("aadhaarImage")) {
        setActiveTab("verification");
      }
    }
  }, []);
  // Pre-fill form with existing data in resubmit mode
  useEffect(() => {
    if (isResubmitMode) {
      // In a real app, fetch the user's existing data from an API
      form.reset({
        ...existingUserData,
      });

      // If state is pre-filled, load its districts
      if (existingUserData.state) {
        const districts = DISTRICTS_BY_STATE[existingUserData.state] || [];
        setAvailableDistricts(districts);
      }

      // If district is pre-filled, load its constituencies
      if (existingUserData.district) {
        const constituencies =
          CONSTITUENCIES_BY_DISTRICT[existingUserData.district] || [];
        setAvailableConstituencies(constituencies);
      }
    }
  }, [isResubmitMode, form]);

  // Watch for state changes to update districts
  const selectedState = form.watch("state");
  const selectedDistrict = form.watch("district");

  // Update districts when state changes
  React.useEffect(() => {
    if (selectedState) {
      setLoadingDistricts(true);

      // Simulate API call delay
      setTimeout(() => {
        const districts = DISTRICTS_BY_STATE[selectedState] || [];
        setAvailableDistricts(districts);
        setLoadingDistricts(false);

        // Only reset district and constituency if not in resubmit mode or if state is a rejected field
        if (!isResubmitMode || rejectedFields.includes("state")) {
          form.setValue("district", "");
          form.setValue("constituency", "");
          setAvailableConstituencies([]);
        }
      }, 800);
    }
  }, [selectedState, form, isResubmitMode, rejectedFields]);

  // Update constituencies when district changes
  React.useEffect(() => {
    if (selectedDistrict) {
      setLoadingConstituencies(true);

      // Simulate API call delay
      setTimeout(() => {
        const constituencies =
          CONSTITUENCIES_BY_DISTRICT[selectedDistrict] || [];
        setAvailableConstituencies(constituencies);
        setLoadingConstituencies(false);

        // Only reset constituency if not in resubmit mode or if district is a rejected field
        if (!isResubmitMode || rejectedFields.includes("district")) {
          form.setValue("constituency", "");
        }
      }, 800);
    }
  }, [selectedDistrict, form, isResubmitMode, rejectedFields]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!wallet) {
      return;
    }

    // Check if required images are uploaded
    if (!values.profileImage && !profileImagePreview) {
      setActiveTab("personal");
      return;
    }

    if (!values.aadhaarImage && !aadhaarImagePreview) {
      setActiveTab("verification");
      return;
    }

    setIsVerifying(true);

    // Simulate verification process
    setTimeout(() => {
      setIsVerifying(false);
      setIsProfileComplete(true);

      toast({
        title: isResubmitMode ? "Verification Resubmitted" : "Profile Updated",
        description: isResubmitMode
          ? "Your updated information has been submitted for verification"
          : "Your profile has been verified successfully",
      });

      // If in resubmit mode, go back to profile with resubmitted flag
      if (isResubmitMode) {
        navigate("/profile?resubmitted=true");
      } else {
        navigate("/vote");
      }
    }, 3000);
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("profileImage", file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAadhaarImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("aadhaarImage", file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAadhaarImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (imageSrc: string) => {
    // Convert data URL to File object
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "profile-photo.png", {
          type: "image/png",
        });
        form.setValue("profileImage", file);
        setProfileImagePreview(imageSrc);
        setShowCamera(false);
      });
  };

  const handleAadhaarCameraCapture = (imageSrc: string) => {
    // Convert data URL to File object
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "aadhaar-photo.png", {
          type: "image/png",
        });
        form.setValue("aadhaarImage", file);
        setAadhaarImagePreview(imageSrc);
        setShowAadhaarCamera(false);
      });
  };

  // Helper function to check if a field needs attention
  const isRejectedField = (fieldName: string) => {
    return isResubmitMode && rejectedFields.includes(fieldName);
  };

  if (!wallet) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Wallet Not Connected</CardTitle>
            <CardDescription>
              Please connect your MetaMask wallet to update your profile.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/")} className="w-full">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          {isResubmitMode && rejectionReason && (
            <Alert className="mb-6 border-destructive/50 bg-destructive/10">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <AlertTitle>Verification Rejected</AlertTitle>
              <AlertDescription className="text-destructive/90">
                {rejectionReason}
              </AlertDescription>
            </Alert>
          )}

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

          {isVerifying ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader size="lg" text="Verifying your information..." />
              <p className="mt-4 text-center text-muted-foreground">
                Please wait while we verify your information with our AI system.
                This may take a few moments.
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

                  <TabsContent value="personal" className="mt-6">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem
                              className={
                                isRejectedField("firstName")
                                  ? "animate-pulse-once"
                                  : ""
                              }
                            >
                              <FormLabel
                                className={`text-foreground ${
                                  isRejectedField("firstName")
                                    ? "font-semibold text-destructive"
                                    : ""
                                }`}
                              >
                                First Name{" "}
                                {isRejectedField("firstName") && (
                                  <span className="text-destructive">*</span>
                                )}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="John"
                                  {...field}
                                  className={`bg-background ${
                                    isRejectedField("firstName")
                                      ? "border-destructive"
                                      : ""
                                  }`}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem
                              className={
                                isRejectedField("lastName")
                                  ? "animate-pulse-once"
                                  : ""
                              }
                            >
                              <FormLabel
                                className={`text-foreground ${
                                  isRejectedField("lastName")
                                    ? "font-semibold text-destructive"
                                    : ""
                                }`}
                              >
                                Last Name{" "}
                                {isRejectedField("lastName") && (
                                  <span className="text-destructive">*</span>
                                )}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Doe"
                                  {...field}
                                  className={`bg-background ${
                                    isRejectedField("lastName")
                                      ? "border-destructive"
                                      : ""
                                  }`}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem
                              className={
                                isRejectedField("phone")
                                  ? "animate-pulse-once"
                                  : ""
                              }
                            >
                              <FormLabel
                                className={`text-foreground ${
                                  isRejectedField("phone")
                                    ? "font-semibold text-destructive"
                                    : ""
                                }`}
                              >
                                Phone Number{" "}
                                {isRejectedField("phone") && (
                                  <span className="text-destructive">*</span>
                                )}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="9876543210"
                                  {...field}
                                  className={`bg-background ${
                                    isRejectedField("phone")
                                      ? "border-destructive"
                                      : ""
                                  }`}
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
                            <FormItem
                              className={
                                isRejectedField("email")
                                  ? "animate-pulse-once"
                                  : ""
                              }
                            >
                              <FormLabel
                                className={`text-foreground ${
                                  isRejectedField("email")
                                    ? "font-semibold text-destructive"
                                    : ""
                                }`}
                              >
                                Email{" "}
                                {isRejectedField("email") && (
                                  <span className="text-destructive">*</span>
                                )}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="john.doe@example.com"
                                  {...field}
                                  className={`bg-background ${
                                    isRejectedField("email")
                                      ? "border-destructive"
                                      : ""
                                  }`}
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
                        render={({
                          field: { value, onChange, ...fieldProps },
                        }) => (
                          <FormItem
                            className={
                              isRejectedField("profileImage")
                                ? "animate-pulse-once"
                                : ""
                            }
                          >
                            <FormLabel
                              className={`text-foreground ${
                                isRejectedField("profileImage")
                                  ? "font-semibold text-destructive"
                                  : ""
                              }`}
                            >
                              Profile Picture{" "}
                              {isRejectedField("profileImage") && (
                                <span className="text-destructive">*</span>
                              )}
                            </FormLabel>
                            <FormControl>
                              <div className="flex flex-col items-center">
                                {profileImagePreview ? (
                                  <div className="mb-4">
                                    <img
                                      src={
                                        profileImagePreview ||
                                        "/placeholder.svg"
                                      }
                                      alt="Profile Preview"
                                      className="w-32 h-32 object-cover rounded-full border"
                                    />
                                  </div>
                                ) : null}
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

                                    <label
                                      htmlFor="profile-image-upload"
                                      className="flex items-center px-4 py-2 bg-primary/10 text-primary rounded-md cursor-pointer hover:bg-primary/20 transition-colors"
                                    >
                                      <FileText className="h-4 w-4 mr-2" />
                                      <span>Upload Photo</span>
                                      <Input
                                        id="profile-image-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleProfileImageChange}
                                        {...fieldProps}
                                      />
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </FormControl>
                            <FormDescription>
                              This image will be used as your profile picture on
                              the platform.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="verification" className="mt-6">
                    <div className="space-y-6">
                      {/* Location Details */}
                      <div className="pt-2">
                        <h3 className="text-lg font-medium mb-4">
                          Voting Location Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="pincode"
                            render={({ field }) => (
                              <FormItem
                                className={
                                  isRejectedField("pincode")
                                    ? "animate-pulse-once"
                                    : ""
                                }
                              >
                                <FormLabel
                                  className={`text-foreground ${
                                    isRejectedField("pincode")
                                      ? "font-semibold text-destructive"
                                      : ""
                                  }`}
                                >
                                  Pincode{" "}
                                  {isRejectedField("pincode") && (
                                    <span className="text-destructive">*</span>
                                  )}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="400001"
                                    {...field}
                                    className={`bg-background ${
                                      isRejectedField("pincode")
                                        ? "border-destructive"
                                        : ""
                                    }`}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem
                                className={
                                  isRejectedField("state")
                                    ? "animate-pulse-once"
                                    : ""
                                }
                              >
                                <FormLabel
                                  className={`text-foreground ${
                                    isRejectedField("state")
                                      ? "font-semibold text-destructive"
                                      : ""
                                  }`}
                                >
                                  State{" "}
                                  {isRejectedField("state") && (
                                    <span className="text-destructive">*</span>
                                  )}
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger
                                      className={
                                        isRejectedField("state")
                                          ? "border-destructive"
                                          : ""
                                      }
                                    >
                                      <SelectValue placeholder="Select a state" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {INDIAN_STATES.map((state) => (
                                      <SelectItem key={state} value={state}>
                                        {state}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                          <FormField
                            control={form.control}
                            name="district"
                            render={({ field }) => (
                              <FormItem
                                className={
                                  isRejectedField("district")
                                    ? "animate-pulse-once"
                                    : ""
                                }
                              >
                                <FormLabel
                                  className={`text-foreground ${
                                    isRejectedField("district")
                                      ? "font-semibold text-destructive"
                                      : ""
                                  }`}
                                >
                                  District{" "}
                                  {isRejectedField("district") && (
                                    <span className="text-destructive">*</span>
                                  )}
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  disabled={!selectedState}
                                >
                                  <FormControl>
                                    <SelectTrigger
                                      loading={loadingDistricts}
                                      className={
                                        isRejectedField("district")
                                          ? "border-destructive"
                                          : ""
                                      }
                                    >
                                      <SelectValue placeholder="Select a district" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {availableDistricts.map((district) => (
                                      <SelectItem
                                        key={district}
                                        value={district}
                                      >
                                        {district}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="constituency"
                            render={({ field }) => (
                              <FormItem
                                className={
                                  isRejectedField("constituency")
                                    ? "animate-pulse-once"
                                    : ""
                                }
                              >
                                <FormLabel
                                  className={`text-foreground ${
                                    isRejectedField("constituency")
                                      ? "font-semibold text-destructive"
                                      : ""
                                  }`}
                                >
                                  Constituency{" "}
                                  {isRejectedField("constituency") && (
                                    <span className="text-destructive">*</span>
                                  )}
                                </FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  disabled={!selectedDistrict}
                                >
                                  <FormControl>
                                    <SelectTrigger
                                      loading={loadingConstituencies}
                                      className={
                                        isRejectedField("constituency")
                                          ? "border-destructive"
                                          : ""
                                      }
                                    >
                                      <SelectValue placeholder="Select a constituency" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {availableConstituencies.map(
                                      (constituency) => (
                                        <SelectItem
                                          key={constituency}
                                          value={constituency}
                                        >
                                          {constituency}
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <FormField
                        control={form.control}
                        name="aadhaarImage"
                        render={({
                          field: { value, onChange, ...fieldProps },
                        }) => (
                          <FormItem
                            className={
                              isRejectedField("aadhaarImage")
                                ? "animate-pulse-once"
                                : ""
                            }
                          >
                            <FormLabel
                              className={`text-foreground ${
                                isRejectedField("aadhaarImage")
                                  ? "font-semibold text-destructive"
                                  : ""
                              }`}
                            >
                              Aadhaar Card Image{" "}
                              {isRejectedField("aadhaarImage") && (
                                <span className="text-destructive">*</span>
                              )}
                            </FormLabel>
                            <FormControl>
                              <div className="flex flex-col items-center">
                                {aadhaarImagePreview ? (
                                  <div className="mb-4 w-full max-w-md">
                                    <img
                                      src={
                                        aadhaarImagePreview ||
                                        "/placeholder.svg"
                                      }
                                      alt="Aadhaar Preview"
                                      className="w-full h-auto object-contain border rounded-md"
                                    />
                                  </div>
                                ) : null}
                                <div className="flex flex-wrap gap-2 justify-center">
                                  {isCameraSupported && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() => setShowAadhaarCamera(true)}
                                      className="flex items-center"
                                    >
                                      <Camera className="h-4 w-4 mr-2" />
                                      Take Photo
                                    </Button>
                                  )}

                                  <label
                                    htmlFor="aadhaar-image-upload"
                                    className="flex items-center px-4 py-2 bg-primary/10 text-primary rounded-md cursor-pointer hover:bg-primary/20 transition-colors"
                                  >
                                    <FileText className="h-4 w-4 mr-2" />
                                    <span>Upload Photo</span>
                                    <Input
                                      id="aadhaar-image-upload"
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={handleAadhaarImageChange}
                                      {...fieldProps}
                                    />
                                  </label>
                                </div>
                              </div>
                            </FormControl>
                            <FormDescription>
                              This image will be used for verification against
                              government records. Please ensure the image is
                              clear and all details are visible.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="pt-4 border-t mt-6">
                  <Button type="submit" className="w-full">
                    {isResubmitMode
                      ? "Resubmit for Verification"
                      : "Submit & Verify"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>

      {/* Camera Dialog for Profile Photo */}
      <Dialog open={showCamera} onOpenChange={setShowCamera}>
        <DialogContent className="p-0 max-w-md overflow-hidden">
          <CameraCapture
            onCapture={handleCameraCapture}
            onClose={() => setShowCamera(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Camera Dialog for Aadhaar Photo */}
      <Dialog open={showAadhaarCamera} onOpenChange={setShowAadhaarCamera}>
        <DialogContent className="p-0 max-w-md overflow-hidden">
          <CameraCapture
            onCapture={handleAadhaarCameraCapture}
            onClose={() => setShowAadhaarCamera(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
