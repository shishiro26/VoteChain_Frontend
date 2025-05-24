import * as z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif"];
const oneDayMs = 24 * 60 * 60 * 1000;

const locationSchema = z.object({
  id: z.string().min(1, { message: "ID is required" }).trim().toLowerCase(),
  name: z.string().min(1, { message: "Name is required" }),
});

export const updateUserSchema = z.object({
  firstName: z
    .string({ required_error: "First name is required" })
    .min(2, { message: "First name must be at least 2 characters long" }),

  lastName: z
    .string({ required_error: "Last name is required" })
    .min(2, { message: "Last name must be at least 2 characters long" }),

  phoneNumber: z
    .string({ required_error: "Phone number is required" })
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(15, { message: "Phone number must be at most 15 digits" })
    .regex(/^\d+$/, { message: "Phone number must contain only digits" }),

  email: z
    .string()
    .email("Invalid email address")
    .max(50, "Email must be less than 50 characters"),

  dob: z.date({
    required_error: "A date of birth is required.",
  }),

  aadharNumber: z
    .string()
    .length(12, "Aadhar number must be exactly 12 digits")
    .regex(/^\d+$/, "Aadhar number must contain only digits"),

  state: locationSchema,
  district: locationSchema,
  mandal: locationSchema,
  constituency: locationSchema,

  profileImage: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, "MAX image size is 5MB.")
    .refine((file) => ALLOWED_FILE_TYPES.includes(file?.type), {
      message: `Allowed file types are: ${ALLOWED_FILE_TYPES.join(", ")}`,
    }),

  aadharImage: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, "MAX image size is 5MB.")
    .refine((file) => ALLOWED_FILE_TYPES.includes(file?.type), {
      message: `Allowed file types are: ${ALLOWED_FILE_TYPES.join(", ")}`,
    }),
});

export const createElectionSchema = z
  .object({
    title: z
      .string()
      .min(10, { message: "Title must be at least 10 characters long" })
      .max(100, { message: "Title must be at most 100 characters long" })
      .refine((val) => /^[a-zA-Z0-9 ]+$/.test(val), {
        message: "Title can only contain letters, numbers, and spaces",
      }),

    purpose: z
      .string()
      .min(10, { message: "Purpose must be at least 10 characters long" })
      .max(1000, { message: "Purpose must be at most 1000 characters long" })
      .refine((val) => /^[a-zA-Z0-9 ,.-]+$/.test(val), {
        message:
          "Purpose can only contain letters, numbers, spaces, commas, periods, and dashes",
      }),

    startDate: z
      .string()
      .datetime({ message: "Invalid start date format" })
      .refine(
        (val) => {
          const now = new Date();
          const start = new Date(val);
          return start.getTime() - now.getTime() >= oneDayMs;
        },
        { message: "Start date must be at least 1 day from today" }
      ),

    endDate: z.string().datetime({ message: "Invalid end date format" }),

    electionType: z.enum(
      ["LOK_SABHA", "VIDHAN_SABHA", "MUNICIPAL", "PANCHAYAT", "BY_ELECTION"],
      {
        errorMap: () => ({ message: "Invalid election type" }),
      }
    ),

    state: locationSchema,
    district: locationSchema,
    mandal: locationSchema,
    constituency: locationSchema,
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end.getTime() - start.getTime() >= oneDayMs;
    },
    {
      message: "End date must be at least 1 day after start date",
      path: ["endDate"],
    }
  );

// Schema: Create Party
export const createPartyFormSchema = z.object({
  partyName: z.string().nonempty("Party name is required"),
  partySymbol: z.string().nonempty("Party symbol is required"),
  leaderName: z.string().nonempty("Leader name is required"),
  leaderEmail: z
    .string()
    .email("Invalid email address")
    .nonempty("Leader email is required"),
  linkExpiry: z.coerce
    .number({
      required_error: "Link expiry is required",
      invalid_type_error: "Link expiry must be a number",
    })
    .min(1, "Link expiry must be at least 1 day")
    .max(30, "Link expiry cannot be more than 30 days"),
});

// Schema: Update Party
export const updatePartyFormSchema = z.object({
  contactEmail: z.string().email("Invalid email format"),
  description: z.string().optional(),
  abbreviation: z.string().optional(),
  website: z.string().url("Invalid URL format").optional(),

  contactPhone: z
    .string()
    .trim()
    .regex(/^\d{10,15}$/, {
      message:
        "Phone number must be between 10 and 15 digits and contain only digits",
    }),
  headquarters: z.string(),
  foundedOn: z.date({
    required_error: "A date of birth is required.",
  }),
  facebook_url: z.string().url("Invalid URL format").optional(),
  twitter_url: z.string().url("Invalid URL format").optional(),
  instagram_url: z.string().url("Invalid URL format").optional(),
  party_image: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, "MAX image size is 5MB.")
    .refine((file) => ALLOWED_FILE_TYPES.includes(file?.type), {
      message: `Allowed file types are: ${ALLOWED_FILE_TYPES.join(", ")}`,
    }),

  manifesto: z.any().optional(),
});
