import db from "@/lib/db";
import { getAuth } from "@/lib/auth/getAuth";

export async function getAuthenticatedUser() {
  const { user } = await getAuth();
  return user;
}

export async function getProjectById(projectId: string) {
  return db.project.findUnique({
    where: {
      id: projectId,
    },
  });
}
