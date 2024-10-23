"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditProjectData, EditProjectSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { deleteProject, editProject } from "@/actions/database/project.action";
import { Switch } from "@/components/ui/switch";
import { ProjectDetailType } from "@/actions/types";

export default function EditProjectForm({
  project,
}: {
  project: ProjectDetailType;
}) {
  const { toast } = useToast();

  const form = useForm<EditProjectData>({
    resolver: zodResolver(EditProjectSchema),
    defaultValues: {
      title: project.title,
      description: project.description,
      visibility: project.privacy_status === "PUBLIC",
    },
  });
  async function deleteHandler() {
    const response = await deleteProject(project.id);

    if (response.success) {
      toast({
        title: "Project deleted ",
        variant: "default",
      });
    } else {
      toast({
        title: response.error,
        variant: "destructive",
      });
    }
  }
  async function onSubmit(values: EditProjectData) {
    const response = await editProject(values, project.id);

    if (response.success) {
      toast({
        title: "Project updated ",
        variant: "default",
      });
    } else {
      toast({
        title: response.error,
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="SuperMarket"
                  className={"h-12"}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="This if for supermarkets ..."
                  className={"h-12"}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="visibility"
          render={({ field }) => (
            <FormItem>
              <div className={"flex items-center justify-between"}>
                <FormLabel>Data Base Visibility</FormLabel>
                <FormControl>
                  <div className="flex items-center justify-between space-x-2">
                    <Switch
                      id="visibility"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className={"flex gap-2"}>
          <Button type="submit" className={"w-full h-12"}>
            Edit
          </Button>
          <Button
            variant={"destructive"}
            type="button"
            className={"w-full h-12"}
            onClick={deleteHandler}
          >
            Delete
          </Button>
        </div>
      </form>
    </Form>
  );
}
