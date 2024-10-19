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
import CreateProjectForm from "@/components/forms/createProjectForm";

export default function CreateProjectDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create New Project</Button>
      </DialogTrigger>
      <DialogContent className=" bg-gray-100 hover:bg-gray-200  dark:bg-gray-900 dark:hover:bg-gray-900 dark:border-gray-700  dark:text-gray-100">
        <DialogHeader>
          <DialogTitle>Create a New Project</DialogTitle>
          <DialogDescription>
            Set up a new project, and we’ll automatically create the associated
            database for you.
          </DialogDescription>
          <CreateProjectForm />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
