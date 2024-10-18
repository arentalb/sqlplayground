"use client";
import React, { useEffect, useState } from "react";
import { getProjectById } from "@/actions/database/project.action";
import { getDatabaseHistory } from "@/actions/database/history.action";
import { Skeleton } from "@/components/ui/skeleton";
import useDatabaseStore from "@/stores/databaseStore";
import { getDatabaseConnection } from "@/actions/database/connection.action";
import DatabaseEditor from "@/app/(admin)/dashboard/projects/_components/databaseEditor";
import DatabaseHeader from "@/app/(admin)/dashboard/projects/_components/databaseHeader";
import { canConvertToTable } from "@/lib/utils";
import DatabaseTable from "@/app/(admin)/dashboard/projects/_components/databaseTable";
import DatabaseTerminal from "@/app/(admin)/dashboard/projects/_components/databaseTerminal";
import DatabaseHistory from "@/app/(admin)/dashboard/projects/_components/databaseHistory";

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  const {
    setProject,
    setHistory,
    setConnectionStatus,
    setQuery,
    setTerminalResult,
    setTerminalError,
    terminalResult,
  } = useDatabaseStore();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchProject = async () => {
      const currentProject = await getProjectById(params.id);
      const history = await getDatabaseHistory(params.id);
      const connectionStatus = await getDatabaseConnection(params.id);

      if (connectionStatus.success) {
        setConnectionStatus(true);
      } else {
        setConnectionStatus(false);
      }
      setProject(currentProject?.data || null);
      setHistory(history.data || []);
      setIsLoading(false);
    };

    fetchProject();

    return () => {
      setHistory([]);
      setProject(null);
      setConnectionStatus(false);
      setQuery("");
      setTerminalResult(null);
      setTerminalError(null);
    };
  }, [
    params.id,
    setConnectionStatus,
    setHistory,
    setProject,
    setQuery,
    setTerminalError,
    setTerminalResult,
  ]);

  if (isLoading) {
    return <ProjectSkeleton />;
  }
  return (
    <div className="px-10 py-6 flex-1 flex flex-col  overflow-auto">
      <DatabaseHeader />
      <div className="pt-2  flex flex-1 gap-4 overflow-auto   ">
        <div className="flex  gap-4 w-full max-h-full rounded-lg flex-1">
          <div className="grid grid-cols-1 grid-rows-2 gap-4 flex-grow flex-1">
            <div className="flex items-center justify-center    h-full">
              <DatabaseEditor />
            </div>
            <div className="flex  items-center justify-center   h-full">
              {canConvertToTable(terminalResult || "") ? (
                <DatabaseTable />
              ) : (
                <DatabaseTerminal />
              )}
            </div>
          </div>
          <div className=" hidden w-1/3 flex-shrink-0 md:flex items-center justify-center   h-full">
            <DatabaseHistory />
          </div>
        </div>
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
