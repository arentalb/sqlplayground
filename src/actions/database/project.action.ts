"use server";
import {
  CloneProjectData,
  CloneProjectSchema,
  CreateProjectData,
  CreateProjectSchema,
} from "@/lib/schemas";
import db from "@/lib/db";
import { getAuth } from "@/lib/auth/getAuth";
import { Prisma } from ".prisma/client";
import { checkDatabaseName } from "@/lib/utils";
import { PrismaClient } from "@prisma/client";
import {
  ForeignKeyConstraint,
  TableColumn,
} from "@/lib/databaseSchemaGenerator";

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

export async function cloneProject(project: CloneProjectData) {
  const validatedFields = CloneProjectSchema.safeParse(project);
  if (!validatedFields.success) {
    return { error: "Validation failed" };
  }

  let newDatabaseName = "";

  try {
    const { user } = await getAuth();
    if (!user) {
      return { error: "Unauthorized" };
    }

    const {
      title,
      description,
      database_name: requestedDatabaseName,
      clonedFromProjectId,
    } = validatedFields.data;

    if (!checkDatabaseName(requestedDatabaseName)) {
      return { error: "Invalid database name" };
    }

    newDatabaseName = requestedDatabaseName;

    const sourceProject = await db.project.findUnique({
      where: { id: clonedFromProjectId },
    });
    if (!sourceProject) {
      return { error: "Source project not found" };
    }

    if (sourceProject.privacy_status === "PRIVATE") {
      return { error: "This project is private" };
    }

    await db.$executeRawUnsafe(
      `SELECT pg_terminate_backend(pid)
       FROM pg_stat_activity
       WHERE datname = $1 AND pid <> pg_backend_pid();`,
      sourceProject.database_name,
    );

    await db.$executeRawUnsafe(
      `CREATE DATABASE ${newDatabaseName} TEMPLATE ${sourceProject.database_name};`,
    );

    const newProject = await db.$transaction(async (tx) => {
      const newProject = await tx.project.create({
        data: {
          database_name: newDatabaseName,
          title,
          description,
          database_url: `postgresql://postgres:12345@localhost:5432/${newDatabaseName}`,
          owner_id: user.id,
          cloned_from_project_id: clonedFromProjectId,
          is_cloned: true,
        },
      });

      const oldDatabaseHistory = await tx.queryHistory.findMany({
        where: {
          project_id: clonedFromProjectId,
        },
      });

      const mappedHistory = oldDatabaseHistory.map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ id, created_at, updated_at, ...history }) => {
          return {
            ...history,
            project_id: newProject.id,
          };
        },
      );

      await tx.queryHistory.createMany({
        data: mappedHistory,
      });

      return newProject;
    });

    return { success: "Project cloned successfully", data: newProject };
  } catch (error) {
    if (newDatabaseName) {
      try {
        await db.$executeRawUnsafe(
          `DROP DATABASE IF EXISTS ${newDatabaseName};`,
        );
      } catch (dropError) {
        return { error: "Failed to drop database" };
      }
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2010"
    ) {
      return { error: "A database with that name already exists" };
    }

    return { error: "An error occurred while cloning the project" };
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

export async function getAllPublicProjects() {
  try {
    const { user } = await getAuth();
    if (!user) {
      return { error: "Unauthorized" };
    }

    const publicProjects = await db.project.findMany({
      where: {
        privacy_status: "PUBLIC",
        owner_id: {
          not: user.id,
        },
      },
    });

    return { success: "Projects fetched successfully", data: publicProjects };
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

    if (project.owner_id !== user.id && project.privacy_status !== "PUBLIC") {
      return { error: "You are not authorized to access this project" };
    }

    return { success: "Project fetched successfully", data: project };
  } catch (error) {
    return { error: "An error occurred while fetching the project" };
  }
}

export async function getProjectDetailById(id: string) {
  try {
    const { user } = await getAuth();
    if (!user) {
      return { error: "Unauthorized" };
    }

    const project = await db.project.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
        clones: {
          select: {
            id: true,
            title: true,
            created_at: true,
            owner: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
        cloned_from_project: {
          select: {
            id: true,
            title: true,
            owner: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      return { error: "Project not found" };
    }

    if (project.owner_id !== user.id && project.privacy_status !== "PUBLIC") {
      return { error: "You are not authorized to access this project" };
    }

    return { success: "Project fetched successfully", data: project };
  } catch (error) {
    return { error: "An error occurred while fetching the project" };
  }
}

export async function getDatabaseSchema(dbName: string) {
  // const currentDB = getTenantPrismaClient(dbName);
  // logTenantPrismaClients();
  let currentDB;
  try {
    currentDB = new PrismaClient({
      datasources: {
        db: {
          url: `postgresql://postgres:12345@localhost:5432/${dbName}`,
        },
      },
    });

    await currentDB.$connect(); // Connect to the database

    // Optional: Log successful connection
    console.log(`Successfully connected to database: ${dbName}`);
  } catch (error) {
    return {
      error: `Failed to establish connection to database ${dbName}`,
    };
  }
  const foreignKeySQL = `
    SELECT
      tc.constraint_name,
      tc.table_name AS local_table,
      kcu.column_name AS local_column,
      ccu.table_name AS referenced_table,
      ccu.column_name AS referenced_column
    FROM
      information_schema.table_constraints AS tc
        JOIN
      information_schema.key_column_usage AS kcu
      ON
        tc.constraint_name = kcu.constraint_name
        JOIN
      information_schema.constraint_column_usage AS ccu
      ON
        ccu.constraint_name = tc.constraint_name
    WHERE
      tc.constraint_type = 'FOREIGN KEY';
  `;

  const databaseSchemaSQL = `WITH PrimaryKeys AS (
    SELECT
      kcu.table_schema,
      kcu.table_name,
      kcu.column_name,
      'PRIMARY KEY' AS key_type
    FROM
      information_schema.table_constraints AS tc
        JOIN
      information_schema.key_column_usage AS kcu
      ON
        tc.constraint_name = kcu.constraint_name
    WHERE
      tc.constraint_type = 'PRIMARY KEY'
  )
                             SELECT
                               c.table_schema,
                               c.table_name,
                               c.column_name,
                               c.data_type,
                               COALESCE(pk.key_type, 'NONE') AS key_type
                             FROM
                               information_schema.columns AS c
                                 LEFT JOIN
                               PrimaryKeys pk
                               ON
                                     c.table_schema = pk.table_schema
                                   AND c.table_name = pk.table_name
                                   AND c.column_name = pk.column_name
                             WHERE
                               c.table_schema NOT IN ('information_schema', 'pg_catalog')
                             ORDER BY
                               c.table_schema, c.table_name, c.ordinal_position;
  `;

  try {
    const schemaData: TableColumn[] =
      await currentDB.$queryRawUnsafe(databaseSchemaSQL);
    const foreignKeyData: ForeignKeyConstraint[] =
      await currentDB.$queryRawUnsafe(foreignKeySQL);

    console.log(schemaData);
    console.log(foreignKeyData);
    return { schemaData, foreignKeyData };
  } catch (error) {
    return { error: "Error executing query" };
  }
}
