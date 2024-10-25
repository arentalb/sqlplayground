"use client";
import { Button } from "@/components/ui/button";
import { CirclePower, Loader } from "lucide-react";
import useDatabaseStore from "@/stores/databaseStore";
import {
  connectToDatabase,
  disconnectFromDatabase,
} from "@/actions/database/connection.action";
import { useToast } from "@/hooks/use-toast";
import React from "react";

export default function DatabaseHeader() {
  const {
    connectionStatus,
    connectionLoading,
    setConnectionStatus,
    setConnectionLoading,
    project,
  } = useDatabaseStore();

  const { toast } = useToast();

  async function handleConnect() {
    setConnectionLoading(true);
    const res = await connectToDatabase(project?.id || "");
    if (res.success) {
      setConnectionStatus(true);
      toast({ title: res.success, variant: "default" });
    }
    if ("error" in res) {
      toast({ title: res.error, variant: "destructive" });
    }
    console.log(res);
    setConnectionLoading(false);
  }
  async function handleDisConnect() {
    setConnectionLoading(true);
    const res = await disconnectFromDatabase(project?.id || "");

    if (res.success) {
      setConnectionStatus(false);
      toast({ title: res.success, variant: "default" });
    } else if ("error" in res) {
      toast({ title: res.error, variant: "destructive" });
    }

    console.log(res);
    setConnectionLoading(false);
  }

  return (
    <div
      className={
        "flex flex-col gap-4 sm:gap-0 sm:flex-row justify-between sm:items-center w-full"
      }
    >
      <div className="flex gap-4 ">
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
        <Button
          className="min-w-28"
          onClick={connectionStatus ? handleDisConnect : handleConnect}
          disabled={connectionLoading}
        >
          {connectionLoading ? (
            <Loader className="animate-spin" />
          ) : connectionStatus ? (
            "Disconnect"
          ) : (
            "Connect"
          )}
        </Button>
        <CirclePower
          className={` ${connectionStatus ? "stroke-green-600" : "stroke-red-600"} `}
        />
      </div>
    </div>
  );
}
