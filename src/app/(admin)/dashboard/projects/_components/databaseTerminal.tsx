"use client";
import React, { useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import useDatabaseStore from "@/stores/databaseStore";

export default function DatabaseTerminal() {
  const { result, error, setError, setResult, connectionStatus } =
    useDatabaseStore();

  useEffect(() => {
    setResult(null);
    setError(null);
  }, [setError, setResult]);

  return (
    <Textarea
      disabled={!connectionStatus}
      readOnly
      value={result || error || ""}
      className="w-full h-full resize-none pt-3 text-[16px] no-scrollbar"
      placeholder="Run Query to see the result"
    />
  );
}
