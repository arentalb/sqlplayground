"use server";

import { CreateProjectData, CreateProjectSchema } from "@/lib/schemas";
import { createErrorResponse, createSuccessResponse } from "@/lib/response";
import db from "@/lib/db";
import { getAuth } from "@/lib/auth/getAuth";

export async function createProject(project: CreateProjectData) {
  const validatedFields = CreateProjectSchema.safeParse(project);

  if (!validatedFields.success) {
    return createErrorResponse("Validation error");
  }

  try {
    const { user } = await getAuth();
    if (!user || !user.id) {
      return createErrorResponse("User does not exist");
    }

    const title = validatedFields.data.title;
    const description = validatedFields.data.description;
    const databaseName = validatedFields.data.database_name;

    await db.$executeRawUnsafe(`CREATE DATABASE "${databaseName}"`);

    const newProject = await db.project.create({
      data: {
        database_name: databaseName,
        title,
        description,
        database_url: `postgresql://postgres:12345@localhost:5432/${databaseName}`,
        owner_id: user.id,
      },
    });

    console.log("Project created:", newProject);
    return createSuccessResponse("Project created successfully");
  } catch (error: any) {
    if (error.code === "P2010") {
      return createErrorResponse("Database with that name already exists");
    }
    console.error("Error creating project:", error);
    return createErrorResponse("Failed to create project");
  }
}
