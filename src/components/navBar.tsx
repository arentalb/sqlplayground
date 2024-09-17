"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth/authProvider";
import SignOutForm from "@/components/forms/signOutForm";

export default function NavBar() {
  const { user } = useAuth();
  return (
    <div
      className={
        "flex justify-between items-center md:px-10 w-full max-w-[1400px] mx-auto py-4 drop-shadow-2xl"
      }
    >
      <Logo />
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
          <li>
            <SignOutForm />
          </li>
        )}
      </ul>
    </div>
  );
}
function Logo() {
  return (
    <div>
      <Image src={"logo-full.svg"} alt={"Logo"} width={150} height={100} />
    </div>
  );
}
