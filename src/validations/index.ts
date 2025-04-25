import * as z from "zod";

export const update_user_schema = z.object({
  first_name: z
    .string({
      required_error: "First name is required",
    })
    .min(2, {
      message: "First name must be at least 2 characters long",
    }),
  last_name: z
    .string({
      required_error: "Last name is required",
    })
    .min(2, {
      message: "Last name must be at least 2 characters long",
    }),
  phone_number: z
    .string({
      required_error: "Phone number is required",
    })
    .min(10, {
      message: "Phone number must be at least 10 digits",
    })
    .max(15, {
      message: "Phone number must be at most 15 digits",
    })
    .regex(/^\d+$/, {
      message: "Phone number must contain only digits",
    }),
  email: z.string().refine(
    (val) => {
      return !val || val.length <= 50;
    },
    {
      message: "Email must be less than 50 characters",
    }
  ),
  state: z
    .string()
    .min(1, {
      message: "State is required",
    })
    .trim()
    .toLowerCase(),
  district: z
    .string()
    .min(1, {
      message: "District is required",
    })
    .trim()
    .toLowerCase(),
  mandal: z
    .string()
    .min(1, {
      message: "Mandal is required",
    })
    .trim()
    .toLowerCase(),
  constituency: z
    .string()
    .min(1, {
      message: "Constituency is required",
    })
    .trim()
    .toLowerCase(),
});

export const formSchema = z.object({
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
  state: z.string({
    required_error: "Please select a state.",
  }),
  mandal: z.string({
    required_error: "Please select a mandal.",
  }),
  district: z.string({
    required_error: "Please select a district.",
  }),
  constituency: z.string({
    required_error: "Please select a constituency.",
  }),
  image: z.instanceof(File).optional().or(z.literal(undefined)),
});
