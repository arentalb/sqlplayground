"use client";
import { useMutation } from "react-query";
import { Button } from "@/components/ui/button";
import useDatabaseStore from "@/stores/databaseStore";
import { Loader } from "lucide-react";
import { TApiError, TApiSuccess } from "@/lib/response.api";
import axiosInstance from "@/lib/axiosInstance";
import { useToast } from "@/hooks/use-toast";

const connectToServerDatabase = async (
  projectId: string,
): Promise<TApiSuccess<string>> => {
  const response = await axiosInstance.post(`/api/database/connection`, {
    projectId: projectId,
  });
  return response.data;
};

const dissConnectToServerDatabase = async (
  projectId: string,
): Promise<TApiSuccess<string>> => {
  const response = await axiosInstance.delete(`/api/database/connection`, {
    data: {
      projectId: projectId,
    },
  });
  return response.data;
};
export default function DatabaseHeader() {
  const {
    connectionStatus,
    connectionLoading,
    setConnectionStatus,
    setConnectionLoading,
    project,
  } = useDatabaseStore();
  const { toast } = useToast();

  const connectMutation = useMutation(
    ["connection"],
    () => connectToServerDatabase(project?.id || ""),
    {
      onSuccess: (data) => {
        if (data.message) {
          setConnectionStatus(true);
        } else {
          setConnectionStatus(false);
        }
      },
      onMutate: () => setConnectionLoading(true),
      onError: (error) => {
        const apiError = error as TApiError;
        setConnectionStatus(false);

        toast({
          variant: "destructive",
          title: apiError.message,
        });
      },
      onSettled: () => {
        setConnectionLoading(false);
      },
    },
  );
  const disconnectMutation = useMutation(
    ["disconnection"],
    () => dissConnectToServerDatabase(project?.id || ""),
    {
      onSuccess: () => {
        setConnectionStatus(false);
      },
      onMutate: () => setConnectionLoading(true),
      onError: (error) => {
        const apiError = error as TApiError;
        setConnectionStatus(false);

        toast({
          variant: "destructive",
          title: apiError.message,
        });
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
