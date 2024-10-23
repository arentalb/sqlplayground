import { z } from "zod";

export type SignUpFormData = z.infer<typeof SignUpFormSchema>;
export const SignUpFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters long" })
    .max(50, { message: "Username must be at most 50 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(50, { message: "Password must be at most 50 characters long" })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must include at least one uppercase letter",
    })
    .refine((val) => /\d/.test(val), {
      message: "Password must include at least one number",
    }),
});

export type SignInFormData = z.infer<typeof SignInFormSchema>;
export const SignInFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(50, { message: "Password must be at most 50 characters long" }),
});

export type CreateProjectData = z.infer<typeof CreateProjectSchema>;
export const CreateProjectSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  database_name: z
    .string()
    .min(1, { message: "Database name is required" })
    .regex(/^[^\s]+$/, { message: "Database name cannot include spaces" }),
});

export const CloneProjectSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  database_name: z
    .string()
    .min(1, { message: "Database name is required" })
    .regex(/^[^\s]+$/, { message: "Database name cannot include spaces" }),
  clonedFromProjectId: z.string(),
});

export type CloneProjectData = z.infer<typeof CloneProjectSchema>;

export type EditProjectData = z.infer<typeof EditProjectSchema>;
export const EditProjectSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  visibility: z.boolean(),
});
