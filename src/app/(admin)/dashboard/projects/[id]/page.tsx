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
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useAuth } from "@/lib/auth/authProvider";
import { useRouter } from "next/navigation";
import FixedHeaderActionsBar from "@/app/(admin)/dashboard/projects/_components/fixedHeaderActionsBar";
import { DatabaseDigram } from "@/app/(admin)/dashboard/projects/_components/databaseDiagram";
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
    project,
    terminalResult,
  } = useDatabaseStore();
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchProject = async () => {
      const currentProject = await getProjectById(params.id);
      if (currentProject?.data?.owner_id !== user?.id) {
        router.replace("/dashboard");
      }
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
    router,
    setConnectionStatus,
    setHistory,
    setProject,
    setQuery,
    setTerminalError,
    setTerminalResult,
    user?.id,
  ]);

  const [currentShownSections, setCurrentShownSections] = useState([
    "history",
    "diagram",
  ]);

  if (isLoading) {
    return <ProjectSkeleton />;
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <FixedHeaderActionsBar>
        <DatabaseHeader
          currentShownSections={currentShownSections}
          setCurrentShownSections={setCurrentShownSections}
        />
      </FixedHeaderActionsBar>
      <div className="px-4 sm:px-10 py-4 flex flex-1 gap-4 overflow-auto">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel className="flex-1">
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel>
                <div className="flex items-center justify-center h-full">
                  <DatabaseEditor />
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle className="my-3" />
              <ResizablePanel>
                <div className="flex items-center justify-center h-full">
                  {canConvertToTable(terminalResult || "") ? (
                    <DatabaseTable />
                  ) : (
                    <DatabaseTerminal />
                  )}
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>

          {/* Conditional Rendering for Diagram and History */}
          {currentShownSections.some((section) =>
            ["diagram", "history"].includes(section),
          ) && (
            <>
              <ResizableHandle withHandle className="mx-3 hidden md:flex" />
              <ResizablePanel className="hidden md:flex flex-col items-center justify-start h-full w-2/3">
                <div className="flex flex-1 overflow-auto w-full h-full rounded-b-lg gap-4">
                  {currentShownSections.includes("diagram") && project && (
                    <div className="flex-1">
                      <DatabaseDigram databaseName={project.database_name} />
                    </div>
                  )}
                  {currentShownSections.includes("history") && (
                    <div className="flex-1">
                      <DatabaseHistory />
                    </div>
                  )}
                </div>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

function ProjectSkeleton() {
  return (
    <div className="px-10 py-6 h-full flex flex-col">
      <div className="h-full w-full flex flex-col items-center gap-4">
        <Skeleton className="min-h-[60px] w-full" />
        <div className="h-full w-full flex gap-4">
          <div className="h-full w-full flex gap-4 flex-col">
            <Skeleton className="min-h-[150px] w-full" />
            <Skeleton className="h-full w-full" />
          </div>
          <Skeleton className="h-full w-3/5" />
        </div>
      </div>
    </div>
  );
}
