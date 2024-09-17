"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function NavBar() {
  return (
    <div
      className={"flex justify-between items-center px-8 py-4 drop-shadow-2xl"}
    >
      <Logo />
      <ul className={" gap-4 hidden md:flex"}>
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
