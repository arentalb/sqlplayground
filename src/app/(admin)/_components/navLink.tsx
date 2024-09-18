"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface NavLinkProp {
  href: string;
  text: string;
  icon: React.ReactNode;
  classname?: string;
  textShown?: boolean;
}

export default function NavLink({
  href,
  text,
  icon,
  textShown = true,
  classname,
}: NavLinkProp) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex border font-semibold px-4 py-2 bg-gray-100 hover:bg-gray-200 inset-0 dark:bg-gray-900/50 dark:hover:bg-gray-900/70 rounded-md gap-4 box-border",
        classname,
        isActive ? "border border-violet-500" : "",
        textShown ? "" : " items-center justify-center",
      )}
    >
      {icon}
      {textShown && text}
    </Link>
  );
}
