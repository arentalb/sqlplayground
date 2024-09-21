import React from "react";
import { getProjectById } from "@/actions/project.action";
import DatabaseHeader from "@/app/(admin)/dashboard/projects/_components/databaseHeader";
import DatabaseEditor from "@/app/(admin)/dashboard/projects/_components/databaseEditor";
import DatabaseTerminal from "@/app/(admin)/dashboard/projects/_components/databaseTerminal";

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  const projectData = await getProjectById(params.id);

  if (!projectData) {
    return null;
  }
  return (
    <div className="px-10 py-6 h-full flex flex-col">
      <DatabaseHeader project={projectData} />
      <div className="pt-4 flex flex-col h-full gap-4">
        <DatabaseEditor project={projectData} />
        <DatabaseTerminal />
      </div>
    </div>
  );
}
