"use server";
import {
  checkAvailabilityTenantPrismaClient,
  createTenantPrismaClient,
  disconnectTenantPrismaClient,
} from "@/lib/tenant";
import { getAuth } from "@/lib/auth/getAuth";
import { getProjectById } from "@/actions/database/project.action";

export async function getDatabaseConnection(projectId: string) {
  try {
    const { user } = await getAuth();
    if (!user) {
      return { error: "Unauthorized" };
    }

    if (!projectId) {
      return { error: "Project ID is required" };
    }

    const project = await getProjectById(projectId);
    if (project.error) {
      return project;
    }

    if (user.id !== project.data?.owner_id) {
      return { error: "You are not the owner of this project" };
    }

    const connectionExists = checkAvailabilityTenantPrismaClient(
      project.data?.database_name,
    );

    if (connectionExists) {
      return { success: "Database connection exists" };
    } else {
      return { error: "No connection exists for the database" };
    }
  } catch (error) {
    return {
      error: "An error occurred while checking the database connection",
    };
  }
}

export async function connectToDatabase(projectId: string) {
  try {
    const { user } = await getAuth();
    if (!user) {
      return { error: "Unauthorized" };
    }

    if (!projectId) {
      return { error: "Project ID is required" };
    }

    const project = await getProjectById(projectId);
    if (project.error) {
      return project;
    }

    if (user.id !== project.data?.owner_id) {
      return { error: "You are not the owner of this project" };
    }

    await createTenantPrismaClient(project.data?.database_name);
    return { success: "Database connection created successfully" };
  } catch (error) {
    return {
      error: "An error occurred while creating the database connection",
    };
  }
}

export async function disconnectFromDatabase(projectId: string) {
  try {
    const { user } = await getAuth();
    if (!user) {
      return { error: "Unauthorized" };
    }

    if (!projectId) {
      return { error: "Project ID is required" };
    }

    const project = await getProjectById(projectId);
    if (project.error) {
      return project;
    }

    if (user.id !== project.data?.owner_id) {
      return { error: "You are not the owner of this project" };
    }

    await disconnectTenantPrismaClient(project.data.database_name);
    return { success: "Database disconnected successfully" };
  } catch (error) {
    return { error: "An error occurred while disconnecting the database" };
  }
}
