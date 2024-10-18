"use server";
import db from "@/lib/db";
import { getAuth } from "@/lib/auth/getAuth";
import { getProjectById } from "@/actions/database/project.action";

export async function getDatabaseHistory(projectId: string) {
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

    const histories = await db.queryHistory.findMany({
      where: { project_id: projectId },
      orderBy: { created_at: "desc" },
    });

    return {
      success: "Project history retrieved successfully",
      data: histories,
    };
  } catch (error) {
    return { error: "An error occurred while fetching the project history" };
  }
}

export async function storeSqlCodeInHistory(
  projectId: string,
  sqlCode: string,
  type: "ERROR" | "SUCCESS",
) {
  try {
    const project = await db.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return { error: "Project not found" };
    }

    const history = await db.queryHistory.create({
      data: { code: sqlCode, project_id: projectId, type },
    });

    return {
      success: "SQL code history saved successfully",
      data: history,
    };
  } catch (error) {
    return { error: "An error occurred while saving the SQL code to history" };
  }
}
