"use client";

import Logo, { LOGO_SIZE } from "@/components/logo";
import { CircleUserRound, FolderKanban, House, Settings } from "lucide-react";
import NavLink from "@/app/(admin)/_components/navLink";
import { useState } from "react";
import SideNavToggle from "@/app/(admin)/_components/sideNavToggler";

export default function SideNav() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div
      className={`hidden sm:flex relative  z-10 p-4 h-full  flex-col  no-scrollbar ${isOpen ? "w-1/6 items-start" : "w-[100px] items-center"}`}
    >
      <SideNavToggle
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        className="absolute  z-20 right-0 bottom-5 translate-x-5"
      />
      <div className="flex  items-center justify-between">
        <Logo size={!isOpen ? LOGO_SIZE.SMALL : LOGO_SIZE.BIG} />
      </div>
      <ul className="flex flex-col h-full mt-8 gap-4">
        <li>
          <NavLink
            href={"/dashboard"}
            icon={<House />}
            text={"Home"}
            textShown={isOpen}
          />
        </li>
        <li>
          <NavLink
            href={"/dashboard/projects"}
            icon={<FolderKanban />}
            text={"Projects"}
            textShown={isOpen}
          />
        </li>
        <li>
          <NavLink
            href={"/dashboard/settings"}
            icon={<Settings />}
            text={"Settings"}
            textShown={isOpen}
          />
        </li>
        <li className="mt-auto">
          <NavLink
            href={"/dashboard/profile"}
            icon={<CircleUserRound />}
            text={"Profile"}
            classname={"mt-auto"}
            textShown={isOpen}
          />
        </li>
      </ul>
    </div>
  );
}