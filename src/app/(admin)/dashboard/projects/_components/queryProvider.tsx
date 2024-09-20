"use client";
import React, { createContext, useContext, useState } from "react";
import { Project } from "@prisma/client";
import {
  connectToTenantDatabase,
  disconnectFromTenantDatabase,
  executeTenantDatabaseQuery,
} from "@/actions/database.action";

interface QueryContextProps {
  query: string;
  setQuery: (query: string) => void;
  result: string | null;
  error: string | null;
  handleQueryRun: () => void;
  project: Project | null;
  setProject: React.Dispatch<React.SetStateAction<Project | null>>;
  connectionStatus: boolean;
  setConnectionStatus: React.Dispatch<React.SetStateAction<boolean>>;
  connectionLoading: boolean;
  setConnectionLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setResult: React.Dispatch<React.SetStateAction<string | null>>;
  handleConnect: () => void;
  handleDisConnect: () => void;
}

const QueryContext = createContext<QueryContextProps | undefined>(undefined);

export const useQueryContext = () => {
  const context = useContext(QueryContext);
  if (!context) {
    throw new Error("useQueryContext must be used within a QueryProvider");
  }
  return context;
};

export const QueryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [query, setQuery] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<boolean>(false);
  const [connectionLoading, setConnectionLoading] = useState<boolean>(true);

  async function handleQueryRun() {
    try {
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
    } catch (err) {
      setError("Failed to execute query");
      console.log(err);
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
  async function handleDisConnect() {
    if (project) {
      await disconnectFromTenantDatabase(project.database_name);
      setConnectionStatus(false);
      setResult(null);
      setError(null);
    }
  }

  return (
    <QueryContext.Provider
      value={{
        query,
        setQuery,
        result,
        error,
        handleQueryRun,
        project,
        setProject,
        connectionStatus,
        setConnectionStatus,
        setError,
        setResult,
        handleConnect,
        handleDisConnect,
        connectionLoading,
        setConnectionLoading,
      }}
    >
      {children}
    </QueryContext.Provider>
  );
};
