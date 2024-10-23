"use client";
import React, { useEffect, useState } from "react";
import { getProjectDetailById } from "@/actions/database/project.action";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth/authProvider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DatabaseZap } from "lucide-react";
import CloneProjectDialog from "@/app/(admin)/dashboard/projects/_components/cloneProjectDialog";
import FixedHeaderActionsBar from "@/app/(admin)/dashboard/projects/_components/fixedHeaderActionsBar";
import { DatabaseDigram } from "@/app/(admin)/dashboard/projects/_components/databaseDiagram";
import ProjectDetail from "@/app/(admin)/dashboard/projects/detail/[id]/_components/projectDetail";
import { ProjectDetailType } from "@/actions/types";
import EditProjectDialog from "@/app/(admin)/dashboard/projects/detail/[id]/_components/editProjectDialog";

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState<ProjectDetailType | null>();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProject = async () => {
      const currentProject = await getProjectDetailById(params.id);
      setProject(currentProject.data);
      setIsLoading(false);
    };

    fetchProject();
    return () => {
      setProject(null);
    };
  }, [params.id, user?.id]);

  if (isLoading) {
    return <ProjectDetailSkeleton />;
  }
  if (!project) {
    return;
  }
  if (project?.privacy_status !== "PUBLIC" && project?.owner_id !== user?.id) {
    return <div>this project may be deleted or may be private </div>;
  }
  return (
    <div className="flex-1 flex flex-col ">
      <FixedHeaderActionsBar>
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-bold">Project Details</h2>

          <div className="flex gap-4 items-center">
            {user?.id === project?.owner_id ? (
              <>
                <Button asChild>
                  <Link
                    href={`/dashboard/projects/${project?.id}`}
                    className="flex gap-2 items-center"
                  >
                    <DatabaseZap width={20} height={20} />
                    Play Ground
                  </Link>
                </Button>
                <EditProjectDialog project={project} />
              </>
            ) : (
              <CloneProjectDialog clonedFromProjectId={params.id} />
            )}
          </div>
        </div>
      </FixedHeaderActionsBar>
      <div className="grid grid-cols-1 md:grid-cols-2 h-full px-10 py-4 gap-4">
        <ProjectDetail project={project} />
        <DatabaseDigram databaseName={project?.database_name} />
      </div>
    </div>
  );
}

function ProjectDetailSkeleton() {
  return (
    <div className="px-10 py-6 h-full flex flex-col ">
      <div className="h-full w-full flex flex-col items-center gap-4">
        <Skeleton className="min-h-[60px] w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full   gap-4">
          <Skeleton className="h-full w-full" />
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    </div>
  );
}
