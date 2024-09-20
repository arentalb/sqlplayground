"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getProjectById } from "@/actions/project.action";
import DatabaseEditor from "@/app/(admin)/dashboard/projects/_components/databaseEditor";
import { useQueryContext } from "@/app/(admin)/dashboard/projects/_components/queryProvider";
import DatabaseTerminal from "@/app/(admin)/dashboard/projects/_components/databaseTerminal";

export default function Page({ params }: { params: { id: string } }) {
  const {
    connectionStatus,
    handleConnect,
    handleDisConnect,
    setProject,
    project,
    connectionLoading,
    setConnectionLoading,
  } = useQueryContext();

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
      <div className="flex gap-4 justify-between border-b pb-4">
        <div className="flex gap-4">
          <div>
            <p className="text-xs text-gray-600 capitalize">Title</p>
            <p>{connectionLoading ? "loading " : project?.title}</p>
          </div>

          <div>
            <p className="text-xs text-gray-600 capitalize">Database</p>
            <p>{connectionLoading ? "loading " : project?.database_name}</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          {connectionStatus ? (
            <div className={"p-2 bg-green-600 w-4 h-4 rounded-full"}></div>
          ) : (
            <div className={"p-2 bg-red-600 w-4 h-4 rounded-full"}></div>
          )}
          <Button onClick={connectionStatus ? handleDisConnect : handleConnect}>
            {connectionStatus ? "Disconnect" : "Connect"}
          </Button>
        </div>
      </div>
      <div className="pt-4 flex flex-col h-full gap-4">
        <DatabaseEditor />
        <DatabaseTerminal />
      </div>
    </div>
  );
}
