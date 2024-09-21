// app/(admin)/dashboard/projects/_components/databaseTerminal.tsx
"use client";
import React, { useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useDatabaseContext } from "@/app/(admin)/dashboard/projects/_components/databaseProvider";

export default function DatabaseTerminal() {
  const { result, error, setError, setResult } = useDatabaseContext();

  useEffect(() => {
    setResult(null);
    setError(null);
  }, [setError, setResult]);

  return (
    <Textarea
      value={result || error || ""}
      className="w-full h-full resize-none pt-3 text-[16px] no-scrollbar"
      placeholder="Run Query to see the result"
    />
  );
}
