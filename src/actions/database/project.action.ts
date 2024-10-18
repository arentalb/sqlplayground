"use server";
import { CreateProjectData, CreateProjectSchema } from "@/lib/schemas";
import db from "@/lib/db";
import { getAuth } from "@/lib/auth/getAuth";
import { Prisma } from ".prisma/client";

export async function createProject(project: CreateProjectData) {
  const validatedFields = CreateProjectSchema.safeParse(project);
  if (!validatedFields.success) {
    return { error: "Validation failed" };
  }

  try {
    const { user } = await getAuth();
    if (!user) {
      return { error: "Unauthorized" };
    }

    const {
      title,
      description,
      database_name: databaseName,
    } = validatedFields.data;

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

    return { success: "Project created successfully", data: newProject };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2010"
    ) {
      return { error: "A database with that name already exists" };
    }

    return { error: "An error occurred while creating the project" };
  }
}

export async function getAllMyProjects() {
  try {
    const { user } = await getAuth();
    if (!user) {
      return { error: "Unauthorized" };
    }

    const myProjects = await db.project.findMany({
      where: { owner_id: user.id },
    });

    return { success: "Projects fetched successfully", data: myProjects };
  } catch (error) {
    return { error: "An error occurred while fetching projects" };
  }
}

export async function getProjectById(id: string) {
  try {
    const { user } = await getAuth();
    if (!user) {
      return { error: "Unauthorized" };
    }

    const project = await db.project.findUnique({ where: { id } });
    if (!project) {
      return { error: "Project not found" };
    }

    if (project.owner_id !== user.id) {
      return { error: "You are not authorized to access this project" };
    }

    return { success: "Project fetched successfully", data: project };
  } catch (error) {
    return { error: "An error occurred while fetching the project" };
  }
}
