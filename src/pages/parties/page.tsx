import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "@/components/shared/loaders/loader";
import { Upload, Info, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { useLocation, useNavigate } from "react-router";
import { updatePartyFormSchema } from "@/validations";
import { useGetPartyDetailsByToken, useUpdatePartyMutation } from "@/api";
import { toast } from "sonner";

export default function SecurePartyCreationPage() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [manifesto, setManifesto] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);

  const navigate = useNavigate();
  const params = new URLSearchParams(useLocation().search);
  const token = params!.get("token");
  const { data: partyDetails, isLoading } = useGetPartyDetailsByToken(
    token || ""
  );

  const updateParty = useUpdatePartyMutation(token || "");

  const form = useForm<z.infer<typeof updatePartyFormSchema>>({
    resolver: zodResolver(updatePartyFormSchema),
    defaultValues: {
      description: "",
      party_image: null,
      manifesto: null,
      abbreviation: "",
      contact_email: "",
      contact_phone: "",
      website: "",
    },
  });

  React.useEffect(() => {
    if (!token) {
      toast.error("Token is required to proceed.");
      setTimeout(() => {
        window.location.replace("/");
      }, 2000);
    }
  }, [token]);

  if (!token) {
    return null;
  }

  const onSubmit = async (values: z.infer<typeof updatePartyFormSchema>) => {
    const formData = new FormData();

    for (const [key, value] of Object.entries(values)) {
      if (key === "party_image" && value instanceof File) {
        formData.append(key, value);
      } else if (typeof value === "string") {
        formData.append(key, value);
      }
    }

    updateParty.mutate(formData, {
      onSuccess: () => {
        form.reset();
        toast.success("Party updated successfully");
        navigate("/");
      },
      onError: (error) => {
        if (error instanceof Error) {
          setTokenError(error.message);
        } else {
          setTokenError("An unknown error occurred");
        }
        toast.error("Failed to update party");
      },
    });
  };
  if (tokenError) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Invalid Link</CardTitle>
            <CardDescription>
              There was a problem with your party creation link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{tokenError}</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/parties")} className="w-full">
              Return to Parties
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Complete Your Party Registration</CardTitle>
          <CardDescription>
            Add additional details to complete your party registration
          </CardDescription>
        </CardHeader>
        {isLoading || !partyDetails ? (
          <CardContent>
            <Loader size="lg" text="Fetching Party Details" />
          </CardContent>
        ) : (
          <CardContent>
            <Alert className="mb-6 flex items-center">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <p>
                  You are creating{" "}
                  <span className="font-bold text-black">
                    {partyDetails.name}
                  </span>{" "}
                  with symbol
                  <span className="text-2xl font-bold">
                    {partyDetails.symbol}
                  </span>{" "}
                  This party will be led by{" "}
                  <span className="font-bold text-black">
                    {partyDetails.leader_name}
                  </span>
                  .
                </p>
              </AlertDescription>
            </Alert>

            {updateParty.isPending ? (
              <Loader size="lg" text="Updating Party " />
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Party Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your party's mission, values, and goals..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A detailed description of your party's platform
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="contact_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter your contact email"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            The official email address for your political party
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contact_phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Phone</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter your contact phone"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            The official phone number for your political party
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Party Website</FormLabel>
                          <FormControl>
                            <Input
                              type="url"
                              placeholder="Enter your party's website URL"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            The official website for your political party
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="abbreviation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Party Abbreviation</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter your party's abbreviation"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            The official abbreviation for your political party
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="party_image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Party Logo (Image)</FormLabel>
                          <FormControl>
                            <div className="flex flex-col items-center">
                              {logoPreview ? (
                                <div className="mb-4">
                                  <img
                                    src={logoPreview || "/placeholder.svg"}
                                    alt="Party logo preview"
                                    className="w-32 h-32 object-contain border rounded-md"
                                  />
                                </div>
                              ) : null}
                              <div className="flex items-center justify-center w-full">
                                <label
                                  htmlFor="logo-upload"
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
                                      PNG, JPG or SVG (MAX. 2MB)
                                    </p>
                                  </div>
                                  <Input
                                    id="logo-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        field.onChange(file);
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                          setLogoPreview(
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
                          </FormControl>
                          <FormDescription>
                            Upload your party's official logo image
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="manifesto"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Party Manifesto (Optional)</FormLabel>
                          <FormControl>
                            <div className="flex flex-col">
                              <div className="flex items-center justify-center w-full">
                                <label
                                  htmlFor="manifesto-upload"
                                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-accent/50"
                                >
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                    {manifesto ? (
                                      <p className="mb-2 text-sm font-medium">
                                        {manifesto}
                                      </p>
                                    ) : (
                                      <>
                                        <p className="mb-2 text-sm text-muted-foreground">
                                          <span className="font-semibold">
                                            Click to upload
                                          </span>{" "}
                                          or drag and drop
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          PDF document (MAX. 10MB)
                                        </p>
                                      </>
                                    )}
                                  </div>
                                  <Input
                                    id="manifesto-upload"
                                    type="file"
                                    accept=".pdf"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        field.onChange(file);
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                          setManifesto(reader.result as string);
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
                            Upload your party's manifesto document
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        )}
        <CardFooter className="flex justify-between border-t pt-6">
          <Button
            variant="outline"
            onClick={() => navigate("/parties")}
            disabled={isLoading || updateParty.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isLoading || updateParty.isPending}
          >
            {isLoading && (
              <>
                <Loader
                  className="mr-2 border-white border-t-primary/90"
                  size="sm"
                />
              </>
            )}
            Create Party & Continue
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
