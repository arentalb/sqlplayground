"use client";
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import useDatabaseStore from "@/stores/databaseStore";

export default function DatabaseTerminal() {
  const { terminalResult, terminalError, connectionStatus } =
    useDatabaseStore();

  return (
    <div className={"h-full w-full"}>
      <Textarea
        disabled={!connectionStatus}
        readOnly
        value={terminalResult || terminalError || ""}
        className="w-full h-full resize-none pt-3 text-[16px] no-scrollbar  focus-visible:ring-0  focus:border-violet-600"
        placeholder="Run Query to see the result"
      />
    </div>
  );
}
