import CreateProjectDialog from "@/app/(admin)/dashboard/projects/_components/createProjectDialog";
import { getAllMyProjects } from "@/actions/database/project.action";
import { Project } from "@prisma/client";
import Link from "next/link";

export default async function Page() {
  const projects = await getAllMyProjects();

  return (
    <div className={"px-10 py-6"}>
      <div className={" py-2"}>
        <CreateProjectDialog />
      </div>
      <div
        className={
          " pt-2 grid  grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-4"
        }
      >
        {projects &&
          projects.data?.map((project: Project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/dashboard/projects/${project.id}`}
      className="border border-gray-200 rounded-3xl p-6 hover:border-violet-500 transition-all duration-300 shadow-lg
    bg-gray-100 hover:bg-gray-200 inset-0 dark:bg-gray-900/50 dark:hover:bg-gray-900/70
    dark:border-gray-700  dark:text-gray-100"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-2 dark:text-gray-100">
        {project.title}
      </h2>
      <p className="text-gray-600 mb-4 dark:text-gray-400">
        {project.description}
      </p>
      <p className="text-sm text-gray-500 mb-1 dark:text-gray-400">
        Created on: {new Date(project.created_at).toLocaleDateString()}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Database: {project.database_name}
      </p>
    </Link>
  );
}
