"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface NavLinkProp {
  href: string;
  text: string;
  icon: React.ReactNode;
  classname?: string;
}
export default function NavLink({ href, text, icon, classname }: NavLinkProp) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex  font-semibold  px-4 py-2 bg-gray-900/50 hover:bg-gray-900/70 rounded-md gap-4",
        classname,
        isActive ? "border border-violet-500" : "",
      )}
    >
      {icon}
      {text}
    </Link>
  );
}
