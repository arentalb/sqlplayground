import Logo from "@/components/logo";
import { CircleUserRound, FolderKanban, House, Settings } from "lucide-react";
import NavLink from "@/app/(admin)/_components/navLink";

export default function SideNav() {
  return (
    <div className={"p-4 h-full flex flex-col overflow-y-scroll no-scrollbar"}>
      <Logo />
      <ul className={"flex flex-col h-full mt-8 gap-4"}>
        <li>
          <NavLink href={"/dashboard"} icon={<House />} text={"Home"} />
        </li>

        <li>
          <NavLink
            href={"/dashboard/projects"}
            icon={<FolderKanban />}
            text={"Projects"}
          />
        </li>
        <li>
          <NavLink
            href={"/dashboard/settings"}
            icon={<Settings />}
            text={"Settings"}
          />
        </li>
        <li className={"mt-auto"}>
          <NavLink
            href={"/dashboard/profile"}
            icon={<CircleUserRound />}
            text={"Profile"}
            classname={"mt-auto"}
          />
        </li>
      </ul>
    </div>
  );
}
