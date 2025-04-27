import * as z from "zod";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Loader } from "@/components/shared/loaders/loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWallet } from "@/store/useWallet";
import { update_user_schema } from "@/validations";
import { toast } from "sonner";
import {
  useConstituenciesQuery,
  useDistrictsQuery,
  useMandalsQuery,
  useStatesQuery,
  useUpdateProfileMutation,
} from "@/hooks/use-location";
import { useNavigate } from "react-router";
import { DropdownLoader } from "@/components/shared/loaders/dropdown-loader";

export default function UpdateProfile() {
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const { wallet } = useWallet();
  const navigate = useNavigate();
  const { mutate: updateProfile, isPending } = useUpdateProfileMutation();

  const form = useForm<z.infer<typeof update_user_schema>>({
    resolver: zodResolver(update_user_schema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone_number: "",
      email: "",
      state: { id: "", name: "" },
      district: { id: "", name: "" },
      mandal: { id: "", name: "" },
      constituency: { id: "", name: "" },
      profile_image: null,
    },
  });

  const selectedState = form.watch("state");
  const selectedDistrict = form.watch("district");
  const selectedMandal = form.watch("mandal");

  const { data: states, isLoading: statesLoader } = useStatesQuery();
  const { data: districts, isLoading: districtLoader } = useDistrictsQuery(
    selectedState.id
  );
  const { data: mandals, isLoading: mandalLoader } = useMandalsQuery(
    selectedDistrict.id
  );
  const { data: constituencies, isLoading: constituencyLoader } =
    useConstituenciesQuery(selectedMandal.id);

  const onSubmit = async (values: z.infer<typeof update_user_schema>) => {
    if (!wallet) {
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
        formData.append(`${key}_id`, value.id);
      } else {
        formData.append(key, value);
      }
    }
    updateProfile(formData);
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="first_name"
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
                    name="last_name"
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
                    name="phone_number"
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

                <div className="pt-2 border-t">
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
                                (state: { id: string }) => state.id === value
                              );
                              field.onChange(selected);
                            }}
                            value={field.value.id}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a state" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {statesLoader ? (
                                <DropdownLoader count={5} />
                              ) : Array.isArray(states) && states.length > 0 ? (
                                states.map((state) => (
                                  <SelectItem key={state.id} value={state.id}>
                                    {state.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <div className="text-center p-2 text-sm text-muted-foreground">
                                  No states available
                                </div>
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
                            disabled={!selectedState}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a district" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {districtLoader ? (
                                <DropdownLoader count={5} />
                              ) : Array.isArray(districts) &&
                                districts.length > 0 ? (
                                districts.map(
                                  (district: { id: string; name: string }) => (
                                    <SelectItem
                                      key={district.id}
                                      value={district.id}
                                    >
                                      {district.name}
                                    </SelectItem>
                                  )
                                )
                              ) : (
                                <div className="text-center p-2 text-sm text-muted-foreground">
                                  No districts available
                                </div>
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
                        <FormItem>
                          <FormLabel className="text-foreground">
                            Mandal
                          </FormLabel>
                          <Select
                            onValueChange={(value) => {
                              const selected = mandals.find(
                                (mandal: { id: string }) => mandal.id === value
                              );
                              field.onChange(selected);
                            }}
                            defaultValue={field.value.name}
                            disabled={!selectedDistrict}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a mandal" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mandalLoader ? (
                                <DropdownLoader count={5} />
                              ) : Array.isArray(mandals) &&
                                mandals.length > 0 ? (
                                mandals.map(
                                  (mandal: { id: string; name: string }) => (
                                    <SelectItem
                                      key={mandal.id}
                                      value={mandal.id}
                                    >
                                      {mandal.name}
                                    </SelectItem>
                                  )
                                )
                              ) : (
                                <div className="text-center p-2 text-sm text-muted-foreground">
                                  No mandals available
                                </div>
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
                            disabled={!selectedMandal}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a constituency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {constituencyLoader ? (
                                <DropdownLoader count={5} />
                              ) : Array.isArray(constituencies) &&
                                constituencies.length > 0 ? (
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
                                )
                              ) : (
                                <div className="text-center p-2 text-sm text-muted-foreground">
                                  No constituencies available
                                </div>
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
                  name="profile_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Upload Image (for face verification)
                      </FormLabel>
                      <FormControl>
                        <div className="flex flex-col items-center">
                          {imagePreview && (
                            <div className="mb-4">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded-full border"
                              />
                            </div>
                          )}
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
                                    field.onChange(file);
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      setImagePreview(reader.result as string);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
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
