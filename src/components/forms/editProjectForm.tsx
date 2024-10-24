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
import { zodResolver } from "@hookform/resolvers/zod";
import { EditProjectData, EditProjectSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { ProjectDetailType } from "@/actions/types";

export default function EditProjectForm({
  project,
  onSubmit,
  onDelete,
}: {
  project: ProjectDetailType;
  onSubmit: (values: EditProjectData) => void;
  onDelete: () => void;
}) {
  const form = useForm<EditProjectData>({
    resolver: zodResolver(EditProjectSchema),
    defaultValues: {
      title: project.title,
      description: project.description,
      visibility: project.privacy_status === "PUBLIC",
    },
  });

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
                <Input placeholder="SuperMarket" className="h-12" {...field} />
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
                  placeholder="This is for supermarkets ..."
                  className="h-12"
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
              <div className="flex items-center justify-between">
                <FormLabel>Database Visibility</FormLabel>
                <FormControl>
                  <Switch
                    id="visibility"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit" className="w-full h-12">
            Edit
          </Button>
          <Button
            variant="destructive"
            type="button"
            className="w-full h-12"
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </form>
    </Form>
  );
}
