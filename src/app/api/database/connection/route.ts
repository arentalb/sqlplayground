import { NextRequest, NextResponse } from "next/server";
import {
  checkAvailabilityTenantPrismaClient,
  createTenantPrismaClient,
  disconnectTenantPrismaClient,
} from "@/lib/tenant";
import {
  CreateErrorResponseApi,
  CreateSuccessResponseApi,
} from "@/lib/response.api";
import { getAuthenticatedUser, getProjectById } from "@/app/api/database/_util";

export async function GET(request: NextRequest) {
  const data = request.nextUrl.searchParams;
  const projectId = data.get("projectId");
  const user = await getAuthenticatedUser();
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

  const connectionExists = checkAvailabilityTenantPrismaClient(
    project.database_name,
  );

  if (connectionExists) {
    return NextResponse.json(
      CreateSuccessResponseApi("Connection exists for the database"),
      { status: 200 },
    );
  } else {
    return NextResponse.json(
      CreateErrorResponseApi("No connection exists for the database"),
      { status: 404 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const projectId = data.projectId;
    const user = await getAuthenticatedUser();

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
      return NextResponse.json(
        CreateErrorResponseApi("You are not the owner "),
        {
          status: 403,
        },
      );
    }

    await createTenantPrismaClient(project.database_name);

    return NextResponse.json(
      CreateSuccessResponseApi(
        "Connection created for database",
        project.database_name,
      ),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing POST request:", error);
    return NextResponse.json(CreateErrorResponseApi("Internal Server Error"), {
      status: 500,
    });
  }
}

export async function DELETE(request: Request) {
  try {
    const data = await request.json();
    const projectId = data.projectId;
    const user = await getAuthenticatedUser();

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
      return NextResponse.json(
        CreateErrorResponseApi("You are not the owner "),
        {
          status: 403,
        },
      );
    }

    await disconnectTenantPrismaClient(project.database_name);
    return NextResponse.json(
      CreateSuccessResponseApi(
        "Disconnected successfully",
        project.database_name,
      ),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error disconnecting from database:", error);

    return NextResponse.json(
      CreateErrorResponseApi("Failed to disconnect from database"),
      {
        status: 500,
      },
    );
  }
}
