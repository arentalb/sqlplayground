import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { useQueryContext } from "@/app/(admin)/dashboard/projects/_components/queryProvider";

export default function DatabaseTerminal() {
  const { error, result } = useQueryContext();

  return (
    <Textarea
      value={result || error || ""}
      className="w-full h-full resize-none pt-3 text-[16px] no-scrollbar"
      placeholder="Run Query to see the result"
    />
  );
}
