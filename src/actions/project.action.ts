"use server";

import { CreateProjectData, CreateProjectSchema } from "@/lib/schemas";
import {
  CreateErrorResponse,
  CreateSuccessResponse,
} from "@/lib/response.server";
import db from "@/lib/db";
import { getAuth } from "@/lib/auth/getAuth";
import { delay } from "@/lib/utils";
import { Prisma } from ".prisma/client";

export async function createProject(project: CreateProjectData) {
  const validatedFields = CreateProjectSchema.safeParse(project);

  if (!validatedFields.success) {
    return CreateErrorResponse("Validation error");
  }

  try {
    const { user } = await getAuth();
    if (!user || !user.id) {
      return CreateErrorResponse("User does not exist");
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
    return CreateSuccessResponse("Project created successfully");
  } catch (error) {
    const prismaError = error as Prisma.PrismaClientKnownRequestError;

    if (prismaError?.code === "P2010") {
      return CreateErrorResponse("Database with that name already exists");
    }
    console.error("Error creating project:", error);
    return CreateErrorResponse("Failed to create project");
  }
}

export async function getAllMyProjects() {
  const { user } = await getAuth();
  if (!user || !user.id) {
    return null;
  }
  try {
    return await db.project.findMany({
      where: {
        owner_id: user.id,
      },
    });
  } catch (error) {
    return null;
  }
}

export async function getProjectById(id: string) {
  const { user } = await getAuth();
  if (!user || !user.id) {
    return null;
  }

  try {
    await delay(1000);

    const foundedProject = await db.project.findUnique({
      where: {
        id: id,
      },
    });

    if (foundedProject?.owner_id === user.id) {
      return foundedProject;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}
