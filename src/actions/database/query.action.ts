"use server";
import { getTenantPrismaClient } from "@/lib/tenant";
import { getAuth } from "@/lib/auth/getAuth";
import { formatPostgresErrorText, handleBigInt } from "@/lib/utils";
import { getProjectById } from "@/actions/database/project.action";
import { storeSqlCodeInHistory } from "@/actions/database/history.action";
import { isQueryAllowed } from "@/lib/sqlValidator";

export async function runQuery(projectId: string, query: string) {
  try {
    const { user } = await getAuth();
    if (!user) {
      return { error: "Unauthorized" };
    }

    if (!query) {
      return { error: "SQL query is required" };
    }

    const userId = user?.id;
    if (!projectId) {
      return { error: "Project ID is required" };
    }

    const project = await getProjectById(projectId);

    if (project.error) {
      return project;
    }

    if (userId !== project?.data?.owner_id) {
      return { error: "You are not the owner of this project" };
    }

    const prisma = getTenantPrismaClient(project.data.database_name);

    if (!prisma) {
      return { error: "No active database connection found" };
    }
    if (!isQueryAllowed(query, project.data.database_name)) {
      return {
        error:
          "Don't try to be a hacker, haha! If you somehow gain unauthorized access, please let us know!",
      };
    }
    try {
      const result = await prisma.$queryRawUnsafe(query);
      const sanitizedResult = handleBigInt(result);

      const executedSql = await storeSqlCodeInHistory(
        projectId,
        query,
        "SUCCESS",
      );

      return {
        success: "Query executed successfully.",
        data: {
          isQuerySuccessful: true,
          oldQuery: JSON.stringify(sanitizedResult),
          history: executedSql,
        },
      };
    } catch (error) {
      const updatedError = {
        // @ts-expect-error "i know what field it returns"
        message: error?.meta?.message,
        // @ts-expect-error "i know what field it returns"
        code: error?.meta?.code,
      };

      if (
        updatedError?.message ===
        "ERROR: cannot insert multiple commands into a prepared statement"
      ) {
        return { error: "Dont run multiple query , Separate them " };
      }
      const executedSql = await storeSqlCodeInHistory(
        projectId,
        query,
        "ERROR",
      );
      return {
        success: "Query execution failed.",
        data: {
          isQuerySuccessful: false,
          oldQuery: formatPostgresErrorText(updatedError),
          history: executedSql,
        },
      };
    }
  } catch (error) {
    return { error: "An internal server error occurred" };
  }
}
