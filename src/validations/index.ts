import * as z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif"];

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
  state: z.object({
    id: z
      .string()
      .min(1, {
        message: "State is required",
      })
      .trim()
      .toLowerCase(),
    name: z.string().min(1, {
      message: "State is required",
    }),
  }),
  district: z.object({
    id: z
      .string()
      .min(1, {
        message: "District is required",
      })
      .trim()
      .toLowerCase(),
    name: z.string().min(1, {
      message: "District is required",
    }),
  }),
  mandal: z.object({
    id: z
      .string()
      .min(1, {
        message: "Mandal is required",
      })
      .trim()
      .toLowerCase(),
    name: z.string().min(1, {
      message: "Mandal is required",
    }),
  }),
  constituency: z.object({
    id: z
      .string()
      .min(1, {
        message: "Constituency is required",
      })
      .trim()
      .toLowerCase(),
    name: z.string().min(1, {
      message: "Constituency is required",
    }),
  }),
  profile_image: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `MAX image size is 5MB.`)
    .refine((file) => ALLOWED_FILE_TYPES.includes(file?.type), {
      message: `Allowed file types are: ${ALLOWED_FILE_TYPES.join(", ")}`,
    }),
  aadhar_image: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `MAX image size is 5MB.`)
    .refine((file) => ALLOWED_FILE_TYPES.includes(file?.type), {
      message: `Allowed file types are: ${ALLOWED_FILE_TYPES.join(", ")}`,
    }),
});

const oneDayMs = 24 * 60 * 60 * 1000;

export const createElectionSchema = z
  .object({
    title: z
      .string()
      .min(10, { message: "Title must be at least 10 characters long" })
      .max(100, { message: "Title must be at most 100 characters long" })
      .nonempty({ message: "Title is required" })
      .refine((val) => /^[a-zA-Z0-9 ]+$/.test(val), {
        message:
          "Title can only contain letters, numbers, and spaces (no special characters)",
      })
      .transform((val) => val.replace(/\s+/g, "").toLowerCase()),
    purpose: z
      .string()
      .min(10, { message: "Purpose must be at least 10 characters long" })
      .max(1000, { message: "Purpose must be at most 1000 characters long" })
      .nonempty({ message: "Purpose is required" })
      .refine((val) => /^[a-zA-Z0-9 -]+$/.test(val), {
        message:
          "Purpose can only contain letters, numbers, and spaces (no special characters)",
      })
      .transform((val) => val.replace(/\s+/g, "").toLowerCase()),

    start_date: z
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

    end_date: z.string().datetime({ message: "Invalid end date format" }),
    election_type: z.enum(
      ["lok_sabha", "vidhan_sabha", "municipal", "panchayat", "by_election"],
      {
        errorMap: () => ({ message: "Invalid election type" }),
      }
    ),

    state: z.object({
      id: z
        .string()
        .min(1, {
          message: "State is required",
        })
        .trim()
        .toLowerCase(),
      name: z.string().min(1, {
        message: "State is required",
      }),
    }),
    district: z.object({
      id: z
        .string()
        .min(1, {
          message: "District is required",
        })
        .trim()
        .toLowerCase(),
      name: z.string().min(1, {
        message: "District is required",
      }),
    }),
    mandal: z.object({
      id: z
        .string()
        .min(1, {
          message: "Mandal is required",
        })
        .trim()
        .toLowerCase(),
      name: z.string().min(1, {
        message: "Mandal is required",
      }),
    }),
    constituency: z.object({
      id: z
        .string()
        .min(1, {
          message: "Constituency is required",
        })
        .trim()
        .toLowerCase(),
      name: z.string().min(1, {
        message: "Constituency is required",
      }),
    }),
  })
  .refine(
    (data) => {
      const start = new Date(data.start_date);
      const end = new Date(data.end_date);
      return end.getTime() - start.getTime() >= oneDayMs;
    },
    {
      message: "End date must be at least 1 day after start date",
      path: ["end_date"],
    }
  );
