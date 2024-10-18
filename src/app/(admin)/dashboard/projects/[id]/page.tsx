"use client";
import React, { useEffect, useState } from "react";
import { getProjectById } from "@/actions/database/project.action";
import DatabaseHeader from "@/app/(admin)/dashboard/projects/_components/databaseHeader";
import DatabaseEditor from "@/app/(admin)/dashboard/projects/_components/databaseEditor";
import DatabaseTerminal from "@/app/(admin)/dashboard/projects/_components/databaseTerminal";
import DatabaseHistory from "@/app/(admin)/dashboard/projects/_components/databaseHistory";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { getDatabaseHistory } from "@/actions/database/history.action";
import { Skeleton } from "@/components/ui/skeleton";
import useDatabaseStore from "@/stores/databaseStore";
import { getDatabaseConnection } from "@/actions/database/connection.action";

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
    <div className="px-10 py-6 max-h-full h-full flex flex-col overflow-hidden">
      <DatabaseHeader />
      <div className="pt-4 flex max-h-full gap-4 overflow-hidden h-full">
        <div className="flex flex-col gap-4  flex-grow  overflow-hidden px-px py-px ">
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel>
              <DatabaseEditor />
            </ResizablePanel>
            <ResizableHandle
              withHandle
              className={"my-1 bg-transparent py-1"}
            />
            <ResizablePanel>
              <DatabaseTerminal />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
        <div className="w-1/3 flex-shrink-0 max-h-full h-full hidden md:flex  overflow-y-auto">
          <DatabaseHistory />
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
