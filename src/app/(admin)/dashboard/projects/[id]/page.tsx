"use client";
import React, { useEffect } from "react";
import { getProjectById } from "@/actions/project.action";
import DatabaseEditor from "@/app/(admin)/dashboard/projects/_components/databaseEditor";
import { useQueryContext } from "@/app/(admin)/dashboard/projects/_components/queryProvider";
import DatabaseTerminal from "@/app/(admin)/dashboard/projects/_components/databaseTerminal";
import DatabaseHeader from "@/app/(admin)/dashboard/projects/_components/databaseHeader";

export default function Page({ params }: { params: { id: string } }) {
  const { setProject, setConnectionLoading } = useQueryContext();

  useEffect(() => {
    async function fetchData() {
      setConnectionLoading(true);
      setProject(await getProjectById(params.id));
      setConnectionLoading(false);
    }
    fetchData();
  }, [params.id, setConnectionLoading, setProject]);

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
