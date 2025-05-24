import { useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createElectionSchema } from "@/validations";
import {
  useConstituenciesQuery,
  useDistrictsQuery,
  useMandalsQuery,
  useStatesQuery,
} from "@/hooks/use-location";
import { DateTimePicker } from "@/components/shared/datetime-picker";
import { useCreateElectionMutation } from "@/api";
import { Loader } from "@/components/ui/loader";

const ElectionTypeOptions = [
  { value: "BY_ELECTION", label: "By Election" },
  { value: "LOK_SABHA", label: "Lok Sabha Election" },
  { value: "VIDHAN_SABHA", label: "Vidhan Sabha Election" },
  { value: "MUNICIPAL", label: "Municipal Election" },
  { value: "PANCHAYAT", label: "Panchayat Election" },
];

export default function CreateConstituencyElectionPage() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof createElectionSchema>>({
    resolver: zodResolver(createElectionSchema),
    defaultValues: {
      title: "",
      purpose: "",
      startDate: "",
      endDate: "",
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

  const createElection = useCreateElectionMutation();

  const onSubmit = async (values: z.infer<typeof createElectionSchema>) => {
    console.log("Form values:", values);
    const payload = {
      title: values.title,
      purpose: values.purpose,
      startDate: new Date(values.startDate).toISOString(),
      endDate: new Date(values.endDate).toISOString(),
      constituencyId: values.constituency.id,
      electionType: values.electionType,
    };

    createElection.mutate(payload, {
      onSuccess: (data) => {
        navigate(`/admin/add-candidates/?electionId=${data.id}`);
      },
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Create Constituency-Level Election
      </h1>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Election Details</CardTitle>
          <CardDescription>
            Fill in the details to create a new constituency-level election
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Mumbai South Constituency Election 2023"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The official title of the election. This needs to be like
                      constituency name + "constituency" + election type +
                      election year.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purpose</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g. Election of Municipal Corporation Member"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A brief description of the purpose and scope of this
                      election.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="electionType"
                render={({ field }) => (
                  <FormItem className="w-[50%]">
                    <FormLabel>Election Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select election type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ElectionTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      A brief description of the purpose and scope of this
                      election.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <DateTimePicker
                        date={field.value}
                        setDate={field.onChange}
                        disabledDates={(date) =>
                          date <
                          new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
                        }
                      />
                      <FormDescription>
                        The start date needs to be at least 1 day from today.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <DateTimePicker
                        date={field.value}
                        setDate={field.onChange}
                        disabledDates={(date) =>
                          date <
                          new Date(
                            new Date(form.getValues("startDate")).getTime() +
                              24 * 60 * 60 * 1000
                          )
                        }
                      />
                      <FormDescription>
                        The end date needs to be at least 1 day after the start
                        date.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="pt-2">
                <h3 className="text-lg font-medium mb-4">
                  Constituency Details
                </h3>

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
                                (state: { id: string; name: string }) => (
                                  <SelectItem key={state.id} value={state.id}>
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
                          District
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
                          disabled={!selectedState?.id || districtLoader}
                        >
                          <FormControl>
                            <SelectTrigger loader={districtLoader}>
                              <SelectValue placeholder="Select a district" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.isArray(districts) &&
                              districts.map(
                                (district: { id: string; name: string }) => (
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
                              (mandal: { id: string }) => mandal.id === value
                            );
                            field.onChange(selected);
                          }}
                          defaultValue={field.value.name}
                          disabled={!selectedDistrict.id || mandalLoader}
                        >
                          <FormControl>
                            <SelectTrigger loader={mandalLoader}>
                              <SelectValue placeholder="Select a mandal" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.isArray(mandals) &&
                              mandals.map(
                                (mandal: { id: string; name: string }) => (
                                  <SelectItem key={mandal.id} value={mandal.id}>
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
                          disabled={!selectedMandal.id || constituencyLoader}
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

              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => navigate("/admin/create-election")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createElection.isPending}>
                  {createElection.isPending && (
                    <Loader
                      size="sm"
                      className="mr-2 border-white border-t-primary"
                    />
                  )}
                  Continue to Add Candidates
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
