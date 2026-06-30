import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Minimum 6 characters"),
});

export type LoginData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters"),

    email: z
      .string()
      .email("Enter a valid email"),

    phoneNumber: z
      .string()
      .optional(),

    password: z
      .string()
      .min(6, "Minimum 6 characters"),

    confirmPassword: z
      .string()
      .min(6, "Minimum 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterData = z.infer<typeof registerSchema>;