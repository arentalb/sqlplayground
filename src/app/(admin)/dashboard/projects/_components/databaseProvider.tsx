"use client";
import React, { createContext, useContext, useState } from "react";
import { Project } from "@prisma/client";

interface DatabaseContextProps {
  query: string;
  setQuery: (query: string) => void;
  result: string | null;
  error: string | null;
  project: Project | null;
  setProject: React.Dispatch<React.SetStateAction<Project | null>>;
  connectionStatus: boolean;
  setConnectionStatus: React.Dispatch<React.SetStateAction<boolean>>;
  connectionLoading: boolean;
  setConnectionLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setResult: React.Dispatch<React.SetStateAction<string | null>>;
  clearDatabaseContext: () => void;
}

const DatabaseContext = createContext<DatabaseContextProps | undefined>(
  undefined,
);

export const useDatabaseContext = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error("useDatabaseContext must be used within a DatabaseProvier");
  }
  return context;
};

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [query, setQuery] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<boolean>(false);
  const [connectionLoading, setConnectionLoading] = useState<boolean>(true);

  function clearDatabaseContext() {
    setError(null);
    setResult(null);
    setProject(null);
    setQuery("");
  }
  return (
    <DatabaseContext.Provider
      value={{
        query,
        setQuery,
        result,
        error,
        project,
        setProject,
        connectionStatus,
        setConnectionStatus,
        setError,
        setResult,
        connectionLoading,
        setConnectionLoading,
        clearDatabaseContext,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};
