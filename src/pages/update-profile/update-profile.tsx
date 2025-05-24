import * as z from "zod";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AlertTriangle, CalendarIcon, Camera, FileText } from "lucide-react";
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
import { Loader } from "@/components/ui/loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWallet } from "@/store/useWallet";
import { updateUserSchema } from "@/validations";
import { toast } from "sonner";
import {
  useConstituenciesQuery,
  useDistrictsQuery,
  useMandalsQuery,
  useStatesQuery,
  useUpdateProfileMutation,
} from "@/hooks/use-location";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CameraCapture } from "@/components/shared/camera-capture";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function UpdateProfile() {
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState("personal");
  const { walletAddress } = useWallet();
  const { mutate: updateProfile, isPending } = useUpdateProfileMutation();
  const [isCameraSupported, setIsCameraSupported] = React.useState(true);
  const [aadharImagePreview, setAadharImagePreview] = React.useState<
    string | null
  >(null);
  const [showCamera, setShowCamera] = React.useState(false);
  const [showAadhaarCamera, setShowAadhaarCamera] = React.useState(false);

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

  const selectedState = form.watch("state");
  const selectedDistrict = form.watch("district");
  const selectedMandal = form.watch("mandal");

  const { data: states = [], isLoading: statesLoader } = useStatesQuery();
  const { data: districts = [], isLoading: districtLoader } = useDistrictsQuery(
    selectedState.id
  );
  const { data: mandals = [], isLoading: mandalLoader } = useMandalsQuery(
    selectedDistrict.id
  );
  const { data: constituencies = [], isLoading: constituencyLoader } =
    useConstituenciesQuery(selectedMandal.id);

  const onSubmit = async (values: z.infer<typeof updateUserSchema>) => {
    if (!walletAddress) {
      toast.message("Wallet not connected", {
        description: "Please connect your MetaMask wallet first",
      });
      return;
    }
    const formData = new FormData();
    for (const [key, value] of Object.entries(values)) {
      if (
        key === "state" ||
        key === "district" ||
        key === "mandal" ||
        key === "constituency"
      ) {
        formData.append(`${key}Id`, value.id);
      } else if (key === "dob") {
        formData.append(key, format(value, "yyyy-MM-dd"));
      } else {
        formData.append(key, value);
      }
    }
    updateProfile(formData);
  };

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

  const handleAadhaarCameraCapture = (imageSrc: string) => {
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "aadhaar-photo.png", {
          type: "image/png",
        });
        form.setValue("aadharImage", file);
        setAadharImagePreview(imageSrc);
        setShowAadhaarCamera(false);
      });
  };

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
            <AlertTriangle className="h-4 w-4 text-amber-500 text-center" />
            <AlertDescription className="text-amber-500">
              Your information must match your Aadhaar for identity
              verification. This includes your location details for voting
              eligibility.
            </AlertDescription>
          </Alert>

          {isPending ? (
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
                          name="aadharNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground">
                                Aadhar Number
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="1234 5678 9012"
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
                          name="dob"
                          render={({ field }) => (
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
                                        !field.value && "text-muted-foreground"
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
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
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
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="phoneNumber"
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
                              <FormLabel className="text-foreground">
                                Email
                              </FormLabel>
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
                        render={({ field }) => (
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
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            field.onChange(file);
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                              setImagePreview(
                                                reader.result as string
                                              );
                                            };
                                            reader.readAsDataURL(file);
                                          }
                                        }}
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
                    <Button
                      onClick={() => setActiveTab("verification")}
                      className="w-full mt-6"
                    >
                      Next
                    </Button>
                  </TabsContent>
                  <TabsContent value="verification" className="mt-6">
                    <div className="space-y-6">
                      <div className="pt-2">
                        <h3 className="text-lg font-medium mb-4">
                          Voting Location Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-foreground">
                                  State
                                </FormLabel>
                                <Select
                                  onValueChange={(value) => {
                                    const selected = states.find(
                                      (state: { id: string }) =>
                                        state.id === value
                                    );
                                    field.onChange(selected);
                                  }}
                                  value={field.value.id}
                                >
                                  <FormControl>
                                    <SelectTrigger loader={statesLoader}>
                                      <SelectValue placeholder="Select a state" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {Array.isArray(states) &&
                                      states?.map(
                                        (state: {
                                          id: string;
                                          name: string;
                                        }) => (
                                          <SelectItem
                                            key={state.id}
                                            value={state.id}
                                          >
                                            {state.name}
                                          </SelectItem>
                                        )
                                      )}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="district"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-foreground">
                                  State
                                </FormLabel>
                                <Select
                                  onValueChange={(value) => {
                                    const selected = districts.find(
                                      (district: { id: string }) =>
                                        district.id === value
                                    );
                                    field.onChange(selected);
                                  }}
                                  defaultValue={field.value.name}
                                  disabled={
                                    !selectedState?.id || districtLoader
                                  }
                                >
                                  <FormControl>
                                    <SelectTrigger loader={districtLoader}>
                                      <SelectValue placeholder="Select a district" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {Array.isArray(districts) &&
                                      districts.map(
                                        (district: {
                                          id: string;
                                          name: string;
                                        }) => (
                                          <SelectItem
                                            key={district.id}
                                            value={district.id}
                                          >
                                            {district.name}
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                          <FormField
                            control={form.control}
                            name="mandal"
                            render={({ field }) => (
                              <FormItem className={"animate-pulse-once"}>
                                <FormLabel className="text-foreground">
                                  Mandal
                                </FormLabel>
                                <Select
                                  onValueChange={(value) => {
                                    const selected = mandals.find(
                                      (mandal: { id: string }) =>
                                        mandal.id === value
                                    );
                                    field.onChange(selected);
                                  }}
                                  defaultValue={field.value.name}
                                  disabled={
                                    !selectedDistrict.id || mandalLoader
                                  }
                                >
                                  <FormControl>
                                    <SelectTrigger loader={mandalLoader}>
                                      <SelectValue placeholder="Select a mandal" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {Array.isArray(mandals) &&
                                      mandals.map(
                                        (mandal: {
                                          id: string;
                                          name: string;
                                        }) => (
                                          <SelectItem
                                            key={mandal.id}
                                            value={mandal.id}
                                          >
                                            {mandal.name}
                                          </SelectItem>
                                        )
                                      )}
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
                                  onValueChange={(value) => {
                                    const selected = constituencies.find(
                                      (constituency: { id: string }) =>
                                        constituency.id === value
                                    );
                                    field.onChange(selected);
                                  }}
                                  defaultValue={field.value.name}
                                  disabled={
                                    !selectedMandal.id || constituencyLoader
                                  }
                                >
                                  <FormControl>
                                    <SelectTrigger loader={constituencyLoader}>
                                      <SelectValue placeholder="Select a constituency" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {Array.isArray(constituencies) &&
                                      constituencies.map(
                                        (constituency: {
                                          id: string;
                                          name: string;
                                        }) => (
                                          <SelectItem
                                            key={constituency.id}
                                            value={constituency.id}
                                          >
                                            {constituency.name}
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
                        name="aadharImage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={"text-foreground"}>
                              Aadhar Image{" "}
                            </FormLabel>
                            <FormControl>
                              <div className="flex flex-col items-center">
                                {aadharImagePreview ? (
                                  <div className="mb-4">
                                    <img
                                      src={aadharImagePreview}
                                      alt="Preview"
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
                                        onClick={() =>
                                          setShowAadhaarCamera(true)
                                        }
                                        className="flex items-center"
                                      >
                                        <Camera className="h-4 w-4 mr-2" />
                                        Take Photo
                                      </Button>
                                    )}

                                    <label
                                      htmlFor="aadhar-image-upload"
                                      className="flex items-center px-4 py-2 bg-primary/10 text-primary rounded-md cursor-pointer hover:bg-primary/20 transition-colors"
                                    >
                                      <FileText className="h-4 w-4 mr-2" />
                                      <span>Upload Photo</span>
                                      <Input
                                        id="aadhar-image-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            field.onChange(file);
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                              setAadharImagePreview(
                                                reader.result as string
                                              );
                                            };
                                            reader.readAsDataURL(file);
                                          }
                                        }}
                                      />
                                    </label>
                                  </div>
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

                    <Button
                      type="submit"
                      className="w-full mt-6"
                      disabled={activeTab === "personal"}
                    >
                      Submit & Verify
                    </Button>
                  </TabsContent>
                </Tabs>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>

      <Dialog open={showCamera} onOpenChange={setShowCamera}>
        <DialogTitle className="sr-only">Capture Profile Image</DialogTitle>
        <DialogContent className="p-0 max-w-md overflow-hidden">
          <CameraCapture
            onCapture={handleCameraCapture}
            onClose={() => setShowCamera(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showAadhaarCamera} onOpenChange={setShowAadhaarCamera}>
        <DialogTitle className="sr-only">Capture Aadhaar Image</DialogTitle>
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
