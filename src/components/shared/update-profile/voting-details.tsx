import React from "react";
import {
  FormField,
  FormDescription,
  FormControl,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HelpCircle, FileText } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { updateUserSchema } from "@/validations";
import { CameraGuidelines } from "./camera-guidelines";
import {
  useConstituenciesQuery,
  useDistrictsQuery,
  useMandalsQuery,
  useStatesQuery,
} from "@/hooks/use-location";

const VotingDetails = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof updateUserSchema>>;
}) => {
  const [showPhotoGuidelines, setShowPhotoGuidelines] = React.useState(false);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);

  const selectedState = form.watch("state");
  const selectedDistrict = form.watch("district");
  const selectedMandal = form.watch("mandal");

  const { data: states = [], isLoading: statesLoader } = useStatesQuery();
  const { data: districts = [], isLoading: districtLoader } = useDistrictsQuery(
    selectedState?.id
  );
  const { data: mandals = [], isLoading: mandalLoader } = useMandalsQuery(
    selectedDistrict?.id
  );
  const { data: constituencies = [], isLoading: constituencyLoader } =
    useConstituenciesQuery(selectedMandal?.id);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">State</FormLabel>
              <Select
                onValueChange={(value) => {
                  const selected = states.find(
                    (state: { id: string }) => state.id === value
                  );
                  field.onChange(selected || null);
                  form.setValue("district", null);
                  form.setValue("mandal", null);
                  form.setValue("constituency", null);
                }}
                value={field.value?.id ?? ""}
              >
                <FormControl>
                  <SelectTrigger loader={statesLoader}>
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {states.map((state: { id: string; name: string }) => (
                    <SelectItem key={state.id} value={state.id}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* District */}
        {selectedState?.id && (
          <FormField
            control={form.control}
            name="district"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">District</FormLabel>
                <Select
                  onValueChange={(value) => {
                    const selected = districts.find(
                      (d: { id: string }) => d.id === value
                    );
                    field.onChange(selected || null);
                    form.setValue("mandal", null);
                    form.setValue("constituency", null);
                  }}
                  value={field.value?.id ?? ""}
                  disabled={districtLoader}
                >
                  <FormControl>
                    <SelectTrigger loader={districtLoader}>
                      <SelectValue placeholder="Select a district" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {districts.map((district: { id: string; name: string }) => (
                      <SelectItem key={district.id} value={district.id}>
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Mandal */}
        {selectedDistrict?.id && (
          <FormField
            control={form.control}
            name="mandal"
            render={({ field }) => (
              <FormItem className={"animate-pulse-once"}>
                <FormLabel className="text-foreground">Mandal</FormLabel>
                <Select
                  onValueChange={(value) => {
                    const selected = mandals.find(
                      (m: { id: string }) => m.id === value
                    );
                    field.onChange(selected || null);
                    form.setValue("constituency", null);
                  }}
                  value={field.value?.id ?? ""}
                  disabled={mandalLoader}
                >
                  <FormControl>
                    <SelectTrigger loader={mandalLoader}>
                      <SelectValue placeholder="Select a mandal" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mandals.map((mandal: { id: string; name: string }) => (
                      <SelectItem key={mandal.id} value={mandal.id}>
                        {mandal.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {selectedMandal?.id && (
          <FormField
            control={form.control}
            name="constituency"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Constituency</FormLabel>
                <Select
                  onValueChange={(value) => {
                    const selected = constituencies.find(
                      (c: { id: string }) => c.id === value
                    );
                    field.onChange(selected || null);
                  }}
                  value={field.value?.id ?? ""}
                  disabled={constituencyLoader}
                >
                  <FormControl>
                    <SelectTrigger loader={constituencyLoader}>
                      <SelectValue placeholder="Select a constituency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {constituencies.map(
                      (constituency: { id: string; name: string }) => (
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
        )}
      </div>

      {/* Aadhar Image Upload */}
      <FormField
        control={form.control}
        name="aadharImage"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={"text-foreground"}>Aadhar Image </FormLabel>
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

                <Collapsible
                  open={showPhotoGuidelines}
                  onOpenChange={setShowPhotoGuidelines}
                  className="w-full mb-1"
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full mb-4">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      {showPhotoGuidelines ? "Hide" : "Show"} Aadhar Guidelines
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CameraGuidelines type="profile" />
                  </CollapsibleContent>
                </Collapsible>

                <div className="flex flex-col items-center justify-center w-full">
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
              This image will be used for verification against government
              records. Please ensure the image is clear and all details are
              visible.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default VotingDetails;
