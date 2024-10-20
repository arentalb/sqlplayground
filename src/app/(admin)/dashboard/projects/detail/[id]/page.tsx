"use client";
import React, { useEffect, useState } from "react";
import {
  getProjectDetailById,
  ProjectDetail,
} from "@/actions/database/project.action";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth/authProvider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DatabaseZap, FilePenLine } from "lucide-react";
import CloneProjectDialog from "@/app/(admin)/dashboard/projects/_components/cloneProjectDialog";

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState<ProjectDetail | null>();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProject = async () => {
      const currentProject = await getProjectDetailById(params.id);
      setProject(currentProject.data);
      setIsLoading(false);
    };

    fetchProject();
  }, [params.id, user?.id]);

  if (isLoading) {
    return <ProjectSkeleton />;
  }
  if (project?.privacy_status !== "PUBLIC" && project?.owner_id !== user?.id) {
    return <div>this project may be deleted or may be private </div>;
  }
  return (
    <div className="px-10  py-8 flex-1 flex flex-col overflow-auto">
      <div className="flex gap-4 justify-between border-b pb-4 mb-8">
        <h2 className="text-xl font-bold ">Project Details</h2>

        <div className="flex gap-4 items-center">
          {user?.id === project?.owner_id ? (
            <>
              <Button asChild>
                <Link
                  href={`/dashboard/projects/${project?.id}`}
                  className={"flex gap-2 items-center"}
                >
                  <DatabaseZap width={20} height={20} />
                  Play Ground
                </Link>
              </Button>
              <Button className={"flex gap-2 items-center"}>
                <FilePenLine width={20} height={20} />
                Edit{" "}
              </Button>
            </>
          ) : (
            <CloneProjectDialog clonedFromProjectId={params.id} />
          )}
        </div>
      </div>
      <div className="flex gap-4 mb-4 ">
        <div>
          <p className="text-xs text-gray-600 capitalize">Title</p>
          <p>{project?.title}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 capitalize">Database</p>
          <p>{project?.database_name}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 capitalize">Owner</p>
          <p>{project?.owner.username}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 capitalize">Is Cloned</p>
          <p>{project?.is_cloned ? "Yes" : "No"}</p>
        </div>
        <div>
          {project?.is_cloned && (
            <>
              <p className="text-xs text-gray-600 capitalize">Cloned from </p>

              <Link
                className={"underline"}
                href={`/dashboard/projects/detail/${project?.cloned_from_project?.id}`}
              >
                {project?.cloned_from_project
                  ? `${project.cloned_from_project.title} `
                  : "Not cloned"}
              </Link>
            </>
          )}
        </div>
        <div>
          <p className="text-xs text-gray-600 capitalize">Visibility</p>
          <p>{project?.privacy_status}</p>
        </div>

        <div>
          <p className="text-xs text-gray-600 capitalize">Created At</p>
          <p>
            {project?.created_at
              ? new Date(project.created_at).toLocaleString()
              : "Unknown"}
          </p>
        </div>
      </div>
      <div className="  mb-8 ">
        <div>
          <p className="text-xs text-gray-600 capitalize">description</p>
          <p>{project?.description}</p>
        </div>
      </div>
      <div className={""}>
        <h3 className="text-lg font-bold ">
          Project cloned from this project :
        </h3>
        {project?.clones?.length ? (
          <ul>
            {project.clones.map((clone) => (
              <li key={clone.id}>
                {/*<strong>{clone.title}</strong> (ID: {clone.id}) by{" "}*/}
                {/*{clone.owner?.username ?? "Unknown"} - Created At:{" "}*/}
                {/*{new Date(clone.created_at).toLocaleString()}*/}
                <Link
                  className={"underline"}
                  href={`/dashboard/projects/detail/${clone?.id}`}
                >
                  {clone ? `${clone.title} ` : "Not cloned"}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No clones available for this project.</p>
        )}
      </div>
    </div>
  );
}

function ProjectSkeleton() {
  return (
    <div className="px-10 py-6 h-full flex flex-col ">
      <div className="h-full w-full flex flex-col items-center gap-4">
        <Skeleton className="min-h-[60px] w-full" />
        <div className={"h-full w-full flex gap-4"}>
          <div className={"h-full w-full flex gap-4 flex-col"}>
            <Skeleton className="min-h-[150px] w-full" />
            <Skeleton className="h-full w-full" />
          </div>
          <Skeleton className="h-full w-3/5" />
        </div>
      </div>
    </div>
  );
}
