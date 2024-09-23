"use client";
import React, { useEffect, useState } from "react";
import { getProjectById } from "@/actions/project.action";
import DatabaseHeader from "@/app/(admin)/dashboard/projects/_components/databaseHeader";
import DatabaseEditor from "@/app/(admin)/dashboard/projects/_components/databaseEditor";
import DatabaseTerminal from "@/app/(admin)/dashboard/projects/_components/databaseTerminal";
import useDatabaseStore from "@/stores/databaseStore";
import { useQuery } from "react-query";
import { notFound } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import DatabaseHistory from "@/app/(admin)/dashboard/projects/_components/databaseHistory";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  const {
    setProject,
    project,
    setResult,
    setQuery,
    setError,
    setConnectionStatus,
  } = useDatabaseStore();

  const [isFetching, setIsFetching] = useState(true);

  const { refetch } = useQuery(
    ["project", params.id],
    () => getProjectById(params.id),
    {
      enabled: false,
      onSuccess: (res) => {
        setIsFetching(false);
        setProject(res);
      },
      onError: () => {
        setIsFetching(false);
      },
    },
  );

  useEffect(() => {
    if (params.id) {
      setIsFetching(true);
      setProject(null);
      refetch();
    }
    return () => {
      setProject(null);
      setQuery("");
      setError("");
      setResult("");
      setConnectionStatus(false);
    };
  }, [
    params.id,
    refetch,
    setConnectionStatus,
    setError,
    setProject,
    setQuery,
    setResult,
  ]);

  if (isFetching) {
    return (
      <div className="px-10 py-6 h-full flex flex-col ">
        <div className="h-full w-full flex flex-col items-center gap-4">
          <Skeleton className="min-h-[60px] w-full" />
          <Skeleton className="min-h-[150px] w-full" />
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    );
  }

  if (!project) {
    return notFound();
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
