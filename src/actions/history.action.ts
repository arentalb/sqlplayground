"use server";
import { getAuth } from "@/lib/auth/getAuth";
import db from "@/lib/db";

export async function storeSqlCodeInHistory(
  projectId: string,
  sqlCode: string,
  type: "ERROR" | "SUCCESS",
) {
  // const { user } = await getAuth();
  // if (!user || !user.id) {
  //   return null;
  // }

  try {
    const foundedProject = await db.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!foundedProject) {
      return null;
    }

    // if (foundedProject.owner_id === user.id) {
    return await db.queryHistory.create({
      data: {
        code: sqlCode,
        project_id: projectId,
        type: type,
      },
    });
    // } else {
    //   return null;
    // }
  } catch (error) {
    console.error("Error storing SQL code in history:", error);
    return null;
  }
}

export async function getSqlCodeInHistories(projectId: string) {
  const { user } = await getAuth();
  if (!user || !user.id) {
    return null;
  }

  try {
    return await db.queryHistory.findMany({
      where: {
        project_id: projectId,
        project: {
          owner_id: user.id,
        },
      },
    });
  } catch (error) {
    console.error("Error retrieving SQL code histories:", error);
    return null;
  }
}
