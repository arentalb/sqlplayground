"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { SignUpFormData, SignUpFormSchema } from "@/lib/schemas";
import { signUp } from "@/actions/auth.action";
import { useToast } from "@/hooks/use-toast";
import { handleResponse } from "@/lib/response";

export default function SignUpForm() {
  const { toast } = useToast();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
    },
  });

  async function onSubmit(values: SignUpFormData) {
    const response = await signUp(values);

    handleResponse(response, {
      onSuccess: (data) => {
        toast({
          title: `Sign-up successful! ${data ?? ""}`,
          variant: "default",
        });
      },
      onError: (message) => {
        toast({
          title: message,
          variant: "destructive",
        });
      },
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Aren Talb" className={"h-12"} {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Aren@example.com"
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="********"
                  type={"password"}
                  className={"h-12"}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className={"w-full h-12"}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
