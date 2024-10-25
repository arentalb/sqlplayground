"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/lib/auth/authProvider";
import Logo, { LOGO_SIZE } from "@/components/logo";

export default function NavBar() {
  const { user } = useAuth();
  return (
    <div
      className={
        "flex justify-between items-center md:px-10 w-full max-w-[1400px] mx-auto py-4 drop-shadow-2xl"
      }
    >
      <Logo size={LOGO_SIZE.BIG} />
      <ul className={" gap-4 hidden md:flex"}>
        {!user ? (
          <>
            <li>
              <Button asChild>
                <Link href={"/signup"}>SIGN UP</Link>
              </Button>
            </li>
            <li>
              <Button asChild>
                <Link href={"/signin"}>SIGN IN</Link>
              </Button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Button asChild>
                <Link href={"/dashboard"}>Dashboard</Link>
              </Button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
