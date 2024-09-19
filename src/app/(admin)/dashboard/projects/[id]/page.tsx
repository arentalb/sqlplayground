"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { Project } from "@prisma/client";
import { getProjectById } from "@/actions/project.action";
import {
  connectToTenantDatabase,
  disconnectFromTenantDatabase,
  executeTenantDatabaseQuery,
} from "@/actions/database.action";

export default function Page({ params }: { params: { id: string } }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<boolean>(false);
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    async function fetchData() {
      setProject(await getProjectById(params.id));
    }
    fetchData();
  }, [params.id]);

  async function handleDisConnect() {
    if (project) {
      await disconnectFromTenantDatabase(project.database_name);
      setConnectionStatus(false);
      setResult(null);
      setError(null);
    }
  }
  const handleConnect = async () => {
    if (project) {
      try {
        const data = await connectToTenantDatabase(project.database_name);

        if (data.message) {
          setConnectionStatus(true);
        }
        if (data.error) {
          setConnectionStatus(false);
          setError(data.error);
        }
      } catch (error) {
        setConnectionStatus(false);
        setError("Failed to connect");
      }
    }
  };
  const handleRun = async () => {
    if (project) {
      try {
        const data = await executeTenantDatabaseQuery(
          project.database_name,
          query,
        );

        if (data.success) {
          setResult(data.result);
          setError(null);
        }
        if (data.error) {
          setError(data.error);
        }
      } catch (error) {
        setError("Failed to connect");
      }
    }
  };
  return (
    <div className="px-10 py-6 h-full flex flex-col">
      <div className="flex gap-4 justify-between border-b pb-4">
        <div className="flex gap-4">
          <div>
            <p className="text-xs text-gray-600 capitalize">Title</p>
            <p>{project?.title}</p>
          </div>

          <div>
            <p className="text-xs text-gray-600 capitalize">Database</p>
            <p>{project?.database_name}</p>
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

          <Button onClick={handleRun}>Run</Button>
        </div>
      </div>
      <div className="pt-4 flex flex-col h-full gap-4">
        <Textarea
          className="h-1/2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter SQL query here"
        />
        <Textarea
          className="h-1/2"
          readOnly
          value={error ? error : JSON.stringify(result) || ""}
        />
      </div>
    </div>
  );
}
