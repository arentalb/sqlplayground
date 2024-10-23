import { LucideIcon } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

interface ProjectDetailItemProps {
  icon: LucideIcon;
  label: string;
  value: string | number | undefined;
  other?: React.ReactNode;
}

export default function ProjectDetailItem({
  icon: Icon,
  label,
  value,
  other,
}: ProjectDetailItemProps) {
  return (
    <div className="group border-b flex items-start gap-3 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition duration-300">
      <Icon
        className={cn(
          "w-5 h-5 text-gray-500 dark:text-gray-400 transition duration-300 group-hover:text-violet-700 group-hover:scale-110",
        )}
        aria-label={label}
      />
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
          {label}
        </p>
        <p className="text-base font-semibold text-gray-700 dark:text-gray-300">
          {value}
        </p>
      </div>
      <div className={"ml-auto self-center"}>{other}</div>
    </div>
  );
}
