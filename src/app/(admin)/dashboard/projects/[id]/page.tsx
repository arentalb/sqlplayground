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
    <div className="px-10 py-6 h-full flex flex-col">
      <DatabaseHeader />
      <div className="pt-4 flex flex-col h-full gap-4">
        <DatabaseEditor />
        <DatabaseTerminal />
      </div>
    </div>
  );
}
