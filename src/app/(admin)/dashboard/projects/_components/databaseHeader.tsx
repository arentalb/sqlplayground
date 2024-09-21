"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Project } from "@prisma/client";
import { Loader } from "lucide-react";
import {
  connectToTenantDatabase,
  disconnectFromTenantDatabase,
  isConnectionAlive,
} from "@/actions/database.action";
import { useDatabaseContext } from "@/app/(admin)/dashboard/projects/_components/databaseProvider";

interface DatabaseHeaderProps {
  project: Project;
}

export default function DatabaseHeader({ project }: DatabaseHeaderProps) {
  const {
    connectionStatus,
    connectionLoading,
    setConnectionStatus,
    setConnectionLoading,
    clearDatabaseContext,
    setProject,
  } = useDatabaseContext();

  const handleConnect = async () => {
    setConnectionLoading(true);
    if (project) {
      try {
        const data = await connectToTenantDatabase(project.database_name);
        if (data.message) {
          setConnectionStatus(true);
        }
        if (data.error) {
          setConnectionStatus(false);
        }
      } catch (error) {
        console.error("Failed to connect:", error);
      } finally {
        setConnectionLoading(false);
      }
    }
  };

  const handleDisConnect = async () => {
    setConnectionLoading(true);

    if (project) {
      try {
        await disconnectFromTenantDatabase(project.database_name);
        setConnectionStatus(false);
      } catch (error) {
        console.error("Failed to disconnect:", error);
      } finally {
        setConnectionLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await isConnectionAlive(project.database_name);
        setConnectionStatus(res);
      } catch (error) {
        console.error("Error checking connection status:", error);
        setConnectionStatus(false);
      } finally {
        setConnectionLoading(false);
      }
    };

    if (project.database_name) {
      fetchData();
    }
    return () => {
      // clearDatabaseContext();
      console.log("return from use effect ");
    };
  }, [
    clearDatabaseContext,
    project.database_name,
    setConnectionLoading,
    setConnectionStatus,
  ]);
  useEffect(() => {
    setProject(project);
  }, [project, setProject]);

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
            className={`p-2 ${
              connectionStatus ? "bg-green-600" : "bg-red-600"
            } w-4 h-4 rounded-full`}
          />
        )}

        <Button onClick={connectionStatus ? handleDisConnect : handleConnect}>
          {connectionStatus ? "Disconnect" : "Connect"}
        </Button>
      </div>
    </div>
  );
}
