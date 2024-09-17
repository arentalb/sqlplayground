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
import { SignInFormData, SignInFormSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { signIn } from "@/actions/auth.action";
import { handleResponse } from "@/lib/response";
import { useAuth } from "@/lib/auth/authProvider";

export default function SignInForm() {
  const { toast } = useToast();
  const { refreshUser } = useAuth();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      password: "",
      email: "",
    },
  });

  async function onSubmit(values: SignInFormData) {
    const response = await signIn(values);

    handleResponse(response, {
      onSuccess: (data) => {
        toast({
          title: `Sign-In successful! ${data ?? ""}`,
          variant: "default",
        });
        refreshUser();
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
          Sign In
        </Button>
      </form>
    </Form>
  );
}
