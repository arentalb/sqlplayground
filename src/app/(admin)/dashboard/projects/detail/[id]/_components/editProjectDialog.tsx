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
import React, { useState } from "react";
import EditProjectForm from "@/components/forms/editProjectForm";
import { ProjectDetailType } from "@/actions/types";
import { useToast } from "@/hooks/use-toast";
import { deleteProject, editProject } from "@/actions/database/project.action";
import { EditProjectData } from "@/lib/schemas";
import { useRouter } from "next/navigation";

export default function EditProjectDialog({
  project,
  refetch,
}: {
  project: ProjectDetailType;
  refetch: () => void;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleDialogClose = () => setIsOpen(false);

  async function handleFormSubmit(values: EditProjectData): Promise<void> {
    const response = await editProject(values, project.id);

    if (response.success) {
      toast({
        title: "Project updated",
        variant: "default",
      });
      handleDialogClose();
      refetch();
    } else {
      toast({
        title: response.error,
        variant: "destructive",
      });
    }
  }

  async function handleDelete(): Promise<void> {
    const response = await deleteProject(project.id);

    if (response.success) {
      toast({
        title: "Project deleted",
        variant: "default",
      });
      handleDialogClose();
      router.push("/dashboard/projects");
    } else {
      toast({
        title: response.error,
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex gap-2 items-center"
          onClick={() => setIsOpen(true)}
        >
          <FilePenLine width={20} height={20} />
          <span>Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-900 dark:border-gray-700 dark:text-gray-100">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Edit your project settings, and we’ll automatically update the
            associated database for you.
          </DialogDescription>
          <EditProjectForm
            project={project}
            onSubmit={handleFormSubmit}
            onDelete={handleDelete}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
