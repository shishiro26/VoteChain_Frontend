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
