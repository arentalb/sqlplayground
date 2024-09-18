"use server";

import { CreateProjectData, CreateProjectSchema } from "@/lib/schemas";
import { createErrorResponse, createSuccessResponse } from "@/lib/response";

export async function createProject(project: CreateProjectData) {
  const validatedFields = CreateProjectSchema.safeParse(project);

  if (!validatedFields.success) {
    return createErrorResponse("Validation error");
  }

  console.log(validatedFields);
  return createSuccessResponse("Project created ");
}
