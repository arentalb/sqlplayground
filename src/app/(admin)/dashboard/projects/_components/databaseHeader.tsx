"use client";
import React from "react";
import { useQueryContext } from "@/app/(admin)/dashboard/projects/_components/queryProvider";
import { Button } from "@/components/ui/button";

export default function DatabaseHeader() {
  const {
    connectionStatus,
    handleConnect,
    handleDisConnect,
    project,
    connectionLoading,
  } = useQueryContext();

  return (
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
  );
}
