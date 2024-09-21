import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function PageSkeleton() {
  return (
    <div className="px-10 py-6 h-full flex flex-col ">
      <div className="h-full w-full flex flex-col items-center gap-4">
        <Skeleton className="h-1/6 w-full" />
        <Skeleton className="h-5/6 w-full" />
      </div>
    </div>
  );
}
