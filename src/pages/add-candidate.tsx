import type React from "react"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader } from "@/components/ui/loader"
import { Plus, Trash2, Upload, User } from "lucide-react"

// Sample elections data
const ELECTIONS = [
  {
    id: "1",
    title: "National General Election 2023",
    status: 0, // Upcoming
  },
  {
    id: "2",
    title: "Maharashtra State Assembly Election",
    status: 0, // Upcoming
  },
  {
    id: "4",
    title: "Delhi Municipal Corporation Election",
    status: 1, // Ongoing
  },
  {
    id: "5",
    title: "Uttar Pradesh By-Election",
    status: 0, // Upcoming
  },
]

const candidateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  party: z.string().min(2, "Party name must be at least 2 characters"),
  description: z.string().optional(),
  image: z.any().optional(),
})

const formSchema = z.object({
  electionId: z.string({
    required_error: "Please select an election",
  }),
  candidates: z.array(candidateSchema).min(1, "At least one candidate is required"),
})

export default function AddCandidatesPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreviews, setImagePreviews] = useState<Record<number, string>>({})
//   const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      electionId: "",
      candidates: [{ name: "", party: "", description: "" }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "candidates",
  })

  const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews((prev) => ({
          ...prev,
          [index]: reader.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)

    // Simulate API call to add candidates
    setTimeout(() => {
      setIsSubmitting(false)
    //   toast({
    //     title: "Candidates Added",
    //     description: `${values.candidates.length} candidates have been added to the election.`,
    //   })

      // Reset form
      form.reset({
        electionId: "",
        candidates: [{ name: "", party: "", description: "" }],
      })
      setImagePreviews({})
    }, 2000)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Add Candidates</h1>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Add Candidates to Election</CardTitle>
          <CardDescription>Select an election and add candidates who will participate</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="electionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Election</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an election" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ELECTIONS.map((election) => (
                          <SelectItem key={election.id} value={election.id}>
                            {election.title} {election.status === 1 ? "(Ongoing)" : "(Upcoming)"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Select the election for which you want to add candidates.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Candidates</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ name: "", party: "", description: "" })}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Candidate
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <Card key={field.id} className="p-4 relative">
                    <div className="absolute top-4 right-4">
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-4">
                          {imagePreviews[index] ? (
                            <img
                              src={imagePreviews[index] || "/placeholder.svg"}
                              alt="Candidate preview"
                              className="w-32 h-32 object-cover rounded-full border"
                            />
                          ) : (
                            <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center border">
                              <User className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <label
                          htmlFor={`candidate-image-${index}`}
                          className="flex items-center px-4 py-2 bg-primary/10 text-primary rounded-md cursor-pointer hover:bg-primary/20 transition-colors"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          <span>Upload Photo</span>
                          <Input
                            id={`candidate-image-${index}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageChange(index, e)}
                          />
                        </label>
                      </div>

                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name={`candidates.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Candidate Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Rajesh Kumar" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`candidates.${index}.party`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Party Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. National Democratic Party" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name={`candidates.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Brief description of the candidate's background, qualifications, etc."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Card>
                ))}
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader size="sm" className="mr-2" /> Adding Candidates...
                    </>
                  ) : (
                    "Add Candidates"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
