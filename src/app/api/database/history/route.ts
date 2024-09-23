import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import {
  CreateErrorResponseApi,
  CreateSuccessResponseApi,
} from "@/lib/response.api";
import { getAuth } from "@/lib/auth/getAuth";
import { getProjectById } from "@/app/api/database/_util";

export async function GET(request: NextRequest) {
  const data = request.nextUrl.searchParams;
  const projectId = data.get("projectId");
  const { user } = await getAuth();

  const userId = user?.id || "";
  if (!projectId) {
    return NextResponse.json(CreateErrorResponseApi("Provide projectId"), {
      status: 403,
    });
  }

  const project = await getProjectById(projectId);

  if (!project) {
    return NextResponse.json(CreateErrorResponseApi("Project not founded "), {
      status: 403,
    });
  }
  if (userId !== project.owner_id) {
    return NextResponse.json(CreateErrorResponseApi("You are not the owner "), {
      status: 403,
    });
  }

  const histories = await db.queryHistory.findMany({
    where: {
      project_id: projectId,
    },
    orderBy: {
      created_at: "desc",
    },
  });
  return NextResponse.json(
    CreateSuccessResponseApi(
      "All history returned for this project ",
      histories,
    ),
    { status: 200 },
  );
}
