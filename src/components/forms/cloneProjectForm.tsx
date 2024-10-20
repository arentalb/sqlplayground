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
import { useForm } from "react-hook-form";
import { cloneProject } from "@/actions/database/project.action";
import { z } from "zod";
import { CloneProjectSchema } from "@/lib/schemas";
import { useRouter } from "next/navigation";

export type CloneProjectData = z.infer<typeof CloneProjectSchema>;

export default function CloneProjectForm({
  clonedFromProjectId,
}: {
  clonedFromProjectId: string;
}) {
  const { toast } = useToast();

  const form = useForm<CloneProjectData>({
    resolver: zodResolver(CloneProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      database_name: "",
      clonedFromProjectId: clonedFromProjectId,
    },
  });

  const router = useRouter();
  async function onSubmit(values: CloneProjectData) {
    const response = await cloneProject(values);

    if (response.success) {
      router.push(`/dashboard/projects/detail/${response.data.id}`);
      toast({
        title: "Project cloned ",
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
          name="database_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data Base Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="SuperMarketDB"
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
          name="clonedFromProjectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Clone from </FormLabel>
              <FormControl>
                <Input
                  placeholder="ID"
                  className={"h-12"}
                  {...field}
                  disabled={true}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className={"w-full h-12"}>
          Clone
        </Button>
      </form>
    </Form>
  );
}
