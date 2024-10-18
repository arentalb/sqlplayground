"use client";
import React from "react";
import useDatabaseStore from "@/stores/databaseStore";

export default function DatabaseHistory() {
  const { connectionStatus, setQuery, history } = useDatabaseStore();

  return (
    <div className="w-full h-full border rounded-md px-3 py-2 shadow-sm overflow-y-auto no-scrollbar flex gap-4 flex-col">
      {history.length === 0 && (
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
