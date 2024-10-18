"use client";
import React, { FormEvent } from "react";
import { useToast } from "@/hooks/use-toast";
import { signOut } from "@/actions/auth.action";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/authProvider";

export default function SignOutForm() {
  const { toast } = useToast();
  const { clearUser } = useAuth();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await clearUser();
    const response = await signOut();
    if (response && "error" in response) {
      toast({
        title: response.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: `Sign-Out successful!`,
        variant: "default",
      });
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <Button type="submit">SIGN OUT</Button>
    </form>
  );
}
