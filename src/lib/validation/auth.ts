import { z } from "zod"

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .email("Enter a valid email address.")

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(128, "Password must be 128 characters or fewer.")

const optionalAddressSchema = z
  .string()
  .trim()
  .max(200, "Address must be 200 characters or fewer.")
  .optional()
  .transform((value) => (value ? value : undefined))

export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required."),
})

export const registerFormSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, "Full name must be at least 3 characters.")
      .max(120, "Full name must be 120 characters or fewer."),
    email: emailSchema,
    phone: z
      .string()
      .trim()
      .regex(/^\+?[0-9]{10,15}$/, "Enter a valid phone number."),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm password is required."),
    address: optionalAddressSchema,
  })
  .superRefine((value, context) => {
    if (value.password !== value.confirmPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match.",
      })
    }
  })

export const forgotPasswordFormSchema = z.object({
  email: emailSchema,
})

export const resetPasswordFormSchema = z
  .object({
    token: z.string().trim().min(1, "Reset token is missing from URL."),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm password is required."),
  })
  .superRefine((value, context) => {
    if (value.password !== value.confirmPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match.",
      })
    }
  })

export function getFirstValidationError(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Please review the form and try again."
}
