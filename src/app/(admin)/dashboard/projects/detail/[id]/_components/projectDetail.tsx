import {
  Calendar,
  ChevronDown,
  Database,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  GitBranch,
  GitCommit,
  GitMerge,
  Info,
  User,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import ProjectDetailItem from "@/app/(admin)/dashboard/projects/detail/[id]/_components/projectDetailItem";
import { ProjectDetailType } from "@/actions/types";

export default function ProjectDetail({
  project,
}: {
  project: ProjectDetailType;
}) {
  return (
    <div className="p-8 border border-gray-200 rounded-lg shadow-md  no-scrollbar flex flex-col  ">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 mb-2 ">
        <ProjectDetailItem
          icon={FileText}
          label="Title"
          value={project?.title}
        />
        <ProjectDetailItem
          icon={Database}
          label="Database"
          value={project?.database_name}
        />
        <ProjectDetailItem
          icon={User}
          label="Owner"
          value={project?.owner?.username}
        />
        <ProjectDetailItem
          icon={project?.privacy_status === "PUBLIC" ? Eye : EyeOff}
          label="Visibility"
          value={project?.privacy_status}
        />
        <ProjectDetailItem
          icon={GitCommit}
          label="Is Cloned"
          value={project?.is_cloned ? "Yes" : "No"}
        />

        {project?.is_cloned && project?.cloned_from_project && (
          //Icon: GitMerge or Link
          <ProjectDetailItem
            icon={GitMerge}
            label="Cloned from"
            value={project?.cloned_from_project.title ?? "Not cloned"}
            other={
              <Link
                className="underline ml-auto self-center text-base font-semibold   text-violet-700 hover:text-violet-800 transition"
                href={`/dashboard/projects/detail/${project?.cloned_from_project.id}`}
              >
                <ExternalLink width={20} height={20} />
              </Link>
            }
          />
        )}

        <ProjectDetailItem
          icon={Calendar}
          label="Created At"
          value={
            project?.created_at
              ? new Date(project?.created_at).toLocaleString()
              : "Unknown"
          }
        />
        <ProjectDetailItem
          icon={GitBranch}
          label="Clones"
          value={project.clones.length}
          other={
            <DropdownMenu>
              <DropdownMenuTrigger
                className={
                  "underline text-violet-700 hover:text-violet-800 transition"
                }
              >
                <ChevronDown />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Clones</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {project?.clones.length ? (
                  <>
                    {project?.clones.map((clone, index) => (
                      <DropdownMenuItem key={index}>
                        <Link
                          className="underline w-full h-full text-violet-700 hover:text-violet-800 transition"
                          href={`/dashboard/projects/detail/${clone.id}`}
                        >
                          {clone.title ?? "No title"}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </>
                ) : (
                  <DropdownMenuItem>
                    <p>No clones available for this project.</p>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          }
        />
      </div>
      <ProjectDetailItem
        icon={Info}
        label="Description"
        value={project?.description ?? "No description available."}
      />
    </div>
  );
}
