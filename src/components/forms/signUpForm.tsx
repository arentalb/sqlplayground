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
import { useAuth } from "@/lib/auth/authProvider";

export default function SignUpForm() {
  const { toast } = useToast();
  const { refreshUser } = useAuth();
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

    if (response && "error" in response) {
      toast({
        title: response.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: `Sign-up successful!`,
        variant: "default",
      });
      refreshUser();
    }
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
          Sign Up
        </Button>
      </form>
    </Form>
  );
}
