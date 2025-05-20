"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateTimePicker } from "@/components/shared/datetime-picker";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// Define the form schema
export const electionDetailsSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  purpose: z.string().min(10, {
    message: "Purpose must be at least 10 characters.",
  }),
  startDate: z.date({
    required_error: "Start date is required.",
  }),
  endDate: z.date({
    required_error: "End date is required.",
  }),
  state: z.string({
    required_error: "State is required.",
  }),
  district: z.string({
    required_error: "District is required.",
  }),
  constituency: z.string().optional(),
  status: z.string().default("0"), // 0 = Upcoming
});

export type ElectionDetailsFormValues = z.infer<typeof electionDetailsSchema>;

interface ElectionDetailsFormProps {
  defaultValues?: Partial<ElectionDetailsFormValues>;
  onSubmit: (values: ElectionDetailsFormValues) => void;
  submitLabel?: string;
  cancelHref?: string;
  isConstituencyRequired?: boolean;
}

export function ElectionDetailsForm({
  defaultValues,
  onSubmit,
  submitLabel = "Continue",
  cancelHref = "/admin/create-election",
  isConstituencyRequired = false,
}: ElectionDetailsFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create form with default values
  const form = useForm<ElectionDetailsFormValues>({
    resolver: zodResolver(
      isConstituencyRequired
        ? electionDetailsSchema.extend({
            constituency: z.string({
              required_error: "Constituency is required.",
            }),
          })
        : electionDetailsSchema
    ),
    defaultValues: {
      title: "",
      purpose: "",
      state: "",
      district: "",
      constituency: "",
      status: "0",
      ...defaultValues,
    },
  });

  // Handle form submission
  const handleSubmit = async (values: ElectionDetailsFormValues) => {
    setIsSubmitting(true);

    // Validate dates
    if (values.endDate < values.startDate) {
      form.setError("endDate", {
        type: "manual",
        message: "End date must be after start date.",
      });
      setIsSubmitting(false);
      return;
    }

    // Call the onSubmit callback
    await onSubmit(values);
    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Maharashtra State Assembly Election 2023"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The official title of the election that will be displayed to
                voters.
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
                  placeholder="e.g. Election of Members of Legislative Assembly"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A brief description of the purpose and scope of this election.
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
                <FormLabel>Start Date & Time</FormLabel>
                <DateTimePicker
                  date={field.value}
                  setDate={field.onChange}
                  disabledDates={(date) => date < new Date()}
                />
                <FormDescription>When voting will begin.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date & Time</FormLabel>
                <DateTimePicker
                  date={field.value}
                  setDate={field.onChange}
                  disabledDates={(date) =>
                    date < new Date() ||
                    (form.getValues("startDate") &&
                      date < form.getValues("startDate"))
                  }
                />
                <FormDescription>When voting will end.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Location Selector Component */}
        <LocationSelector
          form={form}
          requireConstituency={isConstituencyRequired}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="0">Upcoming</SelectItem>
                  <SelectItem value="1">Ongoing</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                The current status of the election. Usually set to "Upcoming"
                when creating.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push(cancelHref)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader className="mr-2" size="sm" /> Saving...
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
