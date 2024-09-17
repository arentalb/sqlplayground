import { z } from "zod";

export type SignUpFormData = z.infer<typeof SignUpFormSchema>;
export const SignUpFormSchema = z.object({
  username: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(2, "password must be at least 2 characters")
    .max(50, "password must be at most 50 characters"),
});

export type SignInFormData = z.infer<typeof SignInFormSchema>;
export const SignInFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(2, "password must be at least 2 characters")
    .max(50, "password must be at most 50 characters"),
});
