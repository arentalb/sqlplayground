"use client";
import { useMutation, useQuery } from "react-query";
import { Project } from "@prisma/client";
import {
  connectToTenantDatabase,
  disconnectFromTenantDatabase,
  isConnectionAlive,
} from "@/actions/database.action";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import useDatabaseStore from "@/stores/databaseStore";

interface DatabaseHeaderProps {
  project: Project;
}

export default function DatabaseHeader({ project }: DatabaseHeaderProps) {
  const {
    connectionStatus,
    connectionLoading,
    setConnectionStatus,
    setConnectionLoading,
    setProject,
    setQuery,
  } = useDatabaseStore();

  const { refetch: checkConnectionStatus } = useQuery(
    ["isConnectionAlive", project.database_name],
    () => isConnectionAlive(project.database_name),
    {
      enabled: !!project.database_name,
      onSuccess: (res) => setConnectionStatus(res),
      onError: () => setConnectionStatus(false),
      refetchOnWindowFocus: false,
    },
  );

  const connectMutation = useMutation(
    () => connectToTenantDatabase(project.database_name),
    {
      onMutate: () => setConnectionLoading(true),
      onSuccess: (data) => {
        if (data.message) {
          setConnectionStatus(true);
        } else {
          setConnectionStatus(false);
        }
      },
      onError: () => {
        setConnectionStatus(false);
      },
      onSettled: () => {
        setConnectionLoading(false);
      },
    },
  );

  const disconnectMutation = useMutation(
    () => disconnectFromTenantDatabase(project.database_name),
    {
      onMutate: () => setConnectionLoading(true),
      onSuccess: () => {
        setConnectionStatus(false);
      },
      onError: () => {
        setConnectionStatus(true);
      },
      onSettled: () => {
        setConnectionLoading(false);
      },
    },
  );

  const handleConnect = () => connectMutation.mutate();
  const handleDisConnect = () => disconnectMutation.mutate();
  useEffect(() => {
    setProject(project);
    checkConnectionStatus();

    return () => {
      disconnectFromTenantDatabase(project.database_name).then((r) => () => {});
      setProject(null);
      setQuery("");
      setConnectionStatus(false);
    };
  }, [
    project,
    setProject,
    checkConnectionStatus,
    setQuery,
    setConnectionStatus,
  ]);

  return (
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
        {connectionLoading ? (
          <Loader />
        ) : (
          <div
            className={`p-2 ${connectionStatus ? "bg-green-600" : "bg-red-600"} w-4 h-4 rounded-full`}
          />
        )}

        <Button onClick={connectionStatus ? handleDisConnect : handleConnect}>
          {connectionStatus ? "Disconnect" : "Connect"}
        </Button>
      </div>
    </div>
  );
}
