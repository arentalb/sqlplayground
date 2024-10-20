"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CopyPlus } from "lucide-react";
import React from "react";
import CloneProjectForm from "@/components/forms/cloneProjectForm";

export default function CloneProjectDialog({
  clonedFromProjectId,
}: {
  clonedFromProjectId: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={"flex gap-2 items-center"}>
          <CopyPlus width={20} height={20} />
          <span>Clone</span>
        </Button>
      </DialogTrigger>
      <DialogContent className=" bg-gray-100 hover:bg-gray-200  dark:bg-gray-900 dark:hover:bg-gray-900 dark:border-gray-700  dark:text-gray-100">
        <DialogHeader>
          <DialogTitle>Clone this Project</DialogTitle>
          <DialogDescription>
            After you cloned we’ll automatically create the associated database
            for you.
          </DialogDescription>
          <CloneProjectForm clonedFromProjectId={clonedFromProjectId} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
