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
import { FilePenLine } from "lucide-react";
import React from "react";
import EditProjectForm from "@/components/forms/editProjectForm";
import { ProjectDetailType } from "@/actions/types";

export default function EditProjectDialog({
  project,
}: {
  project: ProjectDetailType;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={"flex gap-2 items-center"}>
          <FilePenLine width={20} height={20} />
          <span>Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className=" bg-gray-100 hover:bg-gray-200   dark:bg-gray-900 dark:hover:bg-gray-900 dark:border-gray-700  dark:text-gray-100">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Edit your project settings, and we’ll automatically update the
            associated database for you
          </DialogDescription>
          <EditProjectForm project={project} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
