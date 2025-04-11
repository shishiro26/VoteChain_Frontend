import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AlertTriangle, Upload } from "lucide-react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader } from "@/components/shared/loader";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWallet } from "@/store/useWallet";

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
  image: z.instanceof(File).optional().or(z.literal(undefined)),
});

export default function UpdateProfile() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [availableConstituencies, setAvailableConstituencies] = useState<
    string[]
  >([]);
  const { wallet, setIsProfileComplete } = useWallet();
  const navigate = useNavigate();

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

  // Watch for state changes to update districts
  const selectedState = form.watch("state");
  const selectedDistrict = form.watch("district");

  // Update districts when state changes
  React.useEffect(() => {
    if (selectedState) {
      const districts = DISTRICTS_BY_STATE[selectedState] || [];
      setAvailableDistricts(districts);

      // Reset district and constituency when state changes
      form.setValue("district", "");
      form.setValue("constituency", "");
      setAvailableConstituencies([]);
    }
  }, [selectedState, form]);

  // Update constituencies when district changes
  React.useEffect(() => {
    if (selectedDistrict) {
      const constituencies = CONSTITUENCIES_BY_DISTRICT[selectedDistrict] || [];
      setAvailableConstituencies(constituencies);

      // Reset constituency when district changes
      form.setValue("constituency", "");
    }
  }, [selectedDistrict, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!wallet) {
      //   toast({
      //     title: "Wallet not connected",
      //     description: "Please connect your MetaMask wallet first",
      //     variant: "destructive",
      //   });
      return;
    }

    setIsVerifying(true);

    // Simulate verification process
    setTimeout(() => {
      setIsVerifying(false);
      setIsProfileComplete(true);

      //   toast.desc({
      //     title: "Profile Updated",
      //     description: "Your profile has been verified successfully",
      //   });

      //   router.push("/vote");
      //   location.
    }, 3000);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
          <CardTitle>Update Your Profile</CardTitle>
          <CardDescription>
            Complete your profile information for verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 border-amber-500/50 bg-amber-500/10">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-500">
              Your information must match your Aadhaar for identity
              verification. This includes your location details for voting
              eligibility.
            </AlertDescription>
          </Alert>

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">
                          First Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John"
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
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">
                          Last Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Doe"
                            {...field}
                            className="bg-background"
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
                      <FormItem>
                        <FormLabel className="text-foreground">
                          Phone Number
                        </FormLabel>
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

                {/* Location Details */}
                <div className="pt-2 border-t">
                  <h3 className="text-lg font-medium mb-4">
                    Voting Location Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="pincode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">
                            Pincode
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="400001"
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
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">
                            State
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
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
                        <FormItem>
                          <FormLabel className="text-foreground">
                            District
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={!selectedState}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a district" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableDistricts.map((district) => (
                                <SelectItem key={district} value={district}>
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
                        <FormItem>
                          <FormLabel className="text-foreground">
                            Constituency
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={!selectedDistrict}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a constituency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableConstituencies.map((constituency) => (
                                <SelectItem
                                  key={constituency}
                                  value={constituency}
                                >
                                  {constituency}
                                </SelectItem>
                              ))}
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
                  name="image"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Upload Image (for face verification)
                      </FormLabel>
                      <FormControl>
                        <div className="flex flex-col items-center">
                          {imagePreview ? (
                            <div className="mb-4">
                              <img
                                src={imagePreview || "/placeholder.svg"}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded-full border"
                              />
                            </div>
                          ) : null}
                          <div className="flex items-center justify-center w-full">
                            <label
                              htmlFor="image-upload"
                              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-accent/50"
                            >
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground">
                                  <span className="font-semibold">
                                    Click to upload
                                  </span>{" "}
                                  or drag and drop
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  PNG, JPG or JPEG (MAX. 5MB)
                                </p>
                              </div>
                              <Input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    onChange(file);

                                    // Create preview
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      setImagePreview(reader.result as string);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                {...fieldProps}
                              />
                            </label>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        This image will be used for face verification against
                        your Aadhaar card.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Submit & Verify
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
