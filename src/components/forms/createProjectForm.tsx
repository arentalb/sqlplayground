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
import { CreateProjectData, CreateProjectSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { createProject } from "@/actions/database/project.action";

export default function CreateProjectForm() {
  const { toast } = useToast();

  const form = useForm<CreateProjectData>({
    resolver: zodResolver(CreateProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      database_name: "",
    },
  });

  async function onSubmit(values: CreateProjectData) {
    const response = await createProject(values);

    if (response.success) {
      toast({
        title: "Project created ",
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

        <Button type="submit" className={"w-full h-12"}>
          Create
        </Button>
      </form>
    </Form>
  );
}
