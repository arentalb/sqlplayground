"use client";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { getSqlCodeInHistories } from "@/actions/history.action";
import useDatabaseStore from "@/stores/databaseStore";

export default function DatabaseHistory() {
  const { project, setQuery, connectionStatus } = useDatabaseStore();

  const { data, error, isLoading, refetch } = useQuery(
    ["history", project?.id],
    () => getSqlCodeInHistories(project?.id || ""),
    {
      enabled: !!project?.id,
      onSuccess: (res) => {
        console.log(res);
      },
      onError: (error) => {
        console.error(error);
      },
    },
  );

  useEffect(() => {
    if (project?.id) {
      refetch();
    }
  }, [project?.id, refetch]);

  useEffect(() => {
    if (refetch) {
      refetch();
    }
  }, [refetch]);

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error loading history: {error.toString()}</div>;

  return (
    <div className="w-full h-full border rounded-md px-3 py-2 shadow-sm overflow-y-auto no-scrollbar flex gap-4 flex-col">
      {data &&
        data.map((item) => (
          <button
            onClick={() => {
              if (connectionStatus) {
                setQuery(item.code);
              }
            }}
            key={item.id}
            className="border-b pb-1 flex flex-col"
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
