"use client";
import React from "react";
import { useQuery } from "react-query";
import useDatabaseStore from "@/stores/databaseStore";
import { QueryHistory } from "@prisma/client";
import axiosInstance from "@/lib/axiosInstance";
import { TApiError, TApiSuccess } from "@/lib/response.api";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const fetchHistoryData = async (
  projectId: string,
): Promise<TApiSuccess<QueryHistory[]>> => {
  const response = await axiosInstance.get(
    `/api/database/history?projectId=${projectId}`,
  );
  return response.data;
};

export default function DatabaseHistory() {
  const { project, connectionStatus, setQuery, setHistory, history } =
    useDatabaseStore();
  const { toast } = useToast();
  const { data, error, isLoading } = useQuery(
    ["history"],
    () => fetchHistoryData(project?.id || ""),
    {
      onSuccess: (data) => {
        setHistory(data?.data || []);
      },
      onError: (error) => {
        const apiError = error as TApiError;
        toast({
          variant: "destructive",
          title: apiError.message,
        });
      },
    },
  );
  const apiError = error as TApiError;

  return (
    <div className="w-full h-full border rounded-md px-3 py-2 shadow-sm overflow-y-auto no-scrollbar flex gap-4 flex-col">
      {isLoading && <HistorySkeleton />}

      {apiError && (
        <div
          className={
            "flex justify-center items-center my-20 text-2xl text-gray-600"
          }
        >
          <p>Could not show any History </p>
        </div>
      )}

      {data?.data?.length === 0 && history.length === 0 && (
        <div
          className={
            "flex justify-center items-center my-20 text-2xl text-gray-600"
          }
        >
          <p>No History founded </p>
        </div>
      )}
      {history &&
        history.map((item) => (
          <button
            onClick={() => {
              if (connectionStatus) {
                setQuery(item.code);
              }
            }}
            key={item.id}
            className={`border-b pb-1 flex flex-col cursor-default${connectionStatus ? "cursor-pointer" : " cursor-default"}`}
          >
            <p
              className={`lowercase text-xs mb-1 ${item.type === "SUCCESS" ? "text-green-500" : "text-red-500"}`}
            >
              {item.type}
            </p>
            <p className="text-sm text-start">{item.code}</p>
          </button>
        ))}
    </div>
  );
}

function HistorySkeleton() {
  return (
    <div className={"flex flex-col gap-4"}>
      <Skeleton className="min-h-[60px] w-full" />
      <Skeleton className="min-h-[60px] w-full" />
      <Skeleton className="min-h-[60px] w-full" />
      <Skeleton className="min-h-[60px] w-full" />
      <Skeleton className="min-h-[60px] w-full" />
      <Skeleton className="min-h-[60px] w-full" />
      <Skeleton className="min-h-[60px] w-full" />
      <Skeleton className="min-h-[60px] w-full" />
      <Skeleton className="min-h-[60px] w-full" />
    </div>
  );
}
