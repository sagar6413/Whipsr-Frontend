import { z } from "zod";

// Common email validation
const emailValidation = z.string().email({ message: "Invalid email address" });

// Common password validation (example: min 8 chars)
const passwordValidation = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" });

// Login Schema
export const LoginSchema = z.object({
  email: emailValidation,
  password: z.string().min(1, { message: "Password is required" }), // Only require non-empty for login
});
export type LoginInput = z.infer<typeof LoginSchema>;

// Signup Schema
export const SignupSchema = z
  .object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: emailValidation,
    password: passwordValidation,
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val: boolean) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine(
    (data: { password?: string; confirmPassword?: string }) =>
      data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"], // Error applies to the confirmPassword field
    }
  );
export type SignupInput = z.infer<typeof SignupSchema>;

// Forgot Password Schema
export const ForgotPasswordSchema = z.object({
  email: emailValidation,
});
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;

// Reset Password Schema
export const ResetPasswordSchema = z
  .object({
    // Token is usually from URL params, not part of the form data
    newPassword: passwordValidation,
    confirmPassword: z.string(),
  })
  .refine(
    (data: { newPassword?: string; confirmPassword?: string }) =>
      data.newPassword === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

// Username Update Schema
export const UpdateUsernameSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(30, { message: "Username must be no more than 30 characters long" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),
});
export type UpdateUsernameInput = z.infer<typeof UpdateUsernameSchema>;

// Change Password Schema
export const ChangePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Current password is required" }),
    newPassword: passwordValidation, // Reuse common password validation
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from the current password",
    path: ["newPassword"],
  });
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
