"use client";
import { useMutation } from "react-query";
import {
  connectToTenantDatabase,
  disconnectFromTenantDatabase,
} from "@/actions/database.action";
import { Button } from "@/components/ui/button";
import useDatabaseStore from "@/stores/databaseStore";
import { Loader } from "lucide-react";

export default function DatabaseHeader() {
  const {
    connectionStatus,
    connectionLoading,
    setConnectionStatus,
    setConnectionLoading,
    project,
  } = useDatabaseStore();

  const connectMutation = useMutation(
    () => connectToTenantDatabase(project?.database_name || ""),
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
    () => disconnectFromTenantDatabase(project?.database_name || ""),
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
        <div
          className={`p-2 ${connectionStatus ? "bg-green-600" : "bg-red-600"} w-4 h-4 rounded-full`}
        />
        <Button
          className={"w-40"}
          onClick={connectionStatus ? handleDisConnect : handleConnect}
          disabled={connectionLoading}
        >
          {connectionLoading ? (
            <Loader className={"animate-spin"} />
          ) : connectionStatus ? (
            "Disconnect"
          ) : (
            "Connect"
          )}
        </Button>
      </div>
    </div>
  );
}
