import CreateProjectDialog from "@/app/(admin)/dashboard/projects/_components/createProjectDialog";

export default function Page() {
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
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
      </div>
    </div>
  );
}

function ProjectCard() {
  return (
    <div
      className={
        "border rounded-3xl px-8 py-8 hover:border-violet-600 transition-all duration-300"
      }
    >
      card{" "}
    </div>
  );
}
