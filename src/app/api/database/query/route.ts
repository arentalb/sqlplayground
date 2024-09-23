import { NextResponse } from "next/server";
import { formatPostgresErrorText } from "@/lib/utils";
import { getTenantPrismaClient } from "@/lib/tenant";
import { storeSqlCodeInHistory } from "@/actions/history.action";
import {
  CreateErrorResponseApi,
  CreateSuccessResponseApi,
} from "@/lib/response.api";
import { getAuth } from "@/lib/auth/getAuth";
import { getProjectById } from "@/app/api/database/_util";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const projectId = data.projectId;
    const query = data.query;
    const { user } = await getAuth();

    const userId = user?.id || "";
    if (!projectId || !query) {
      return NextResponse.json(
        CreateErrorResponseApi("Provide projectId and query"),
        {
          status: 403,
        },
      );
    }

    const project = await getProjectById(projectId);

    if (!project) {
      return NextResponse.json(CreateErrorResponseApi("Project not founded "), {
        status: 403,
      });
    }
    if (userId !== project.owner_id) {
      return NextResponse.json(
        CreateErrorResponseApi("You are not the owner "),
        {
          status: 403,
        },
      );
    }
    const prisma = getTenantPrismaClient(project.database_name);

    if (!prisma) {
      return NextResponse.json(CreateErrorResponseApi("No connection found"), {
        status: 404,
      });
    }

    try {
      const result = await prisma.$queryRawUnsafe(query);

      const runnedSql = await storeSqlCodeInHistory(
        projectId,
        query,
        "SUCCESS",
      );

      return NextResponse.json(
        CreateSuccessResponseApi("sqlrun", {
          oldQuery: JSON.stringify(result),
          history: runnedSql,
        }),
        { status: 200 },
      );
    } catch (error) {
      console.log(error);
      const updatedError = {
        // @ts-expect-error "i know what field it returns"
        message: error?.meta?.message,
        // @ts-expect-error "i know what field it returns"
        code: error?.meta?.code,
      };
      const runnedSql = await storeSqlCodeInHistory(projectId, query, "ERROR");

      return NextResponse.json(
        CreateSuccessResponseApi("sqlerror", {
          oldQuery: formatPostgresErrorText(updatedError),
          history: runnedSql,
        }),
        { status: 200 },
      );
    }
  } catch (error) {
    console.error("Error processing POST request:", error);
    return NextResponse.json(CreateErrorResponseApi("Internal Server Error"), {
      status: 500,
    });
  }
}
