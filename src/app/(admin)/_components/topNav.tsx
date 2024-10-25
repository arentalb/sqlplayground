"use client";
import ThemeToggle from "@/components/themeToggle";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Cable,
  Flag,
  FolderKanban,
  Home,
  Menu,
  Settings,
  UserCircle,
  X,
} from "lucide-react";
import SignOutForm from "@/components/forms/signOutForm";
import { useAuth } from "@/lib/auth/authProvider";
import { useEffect, useState } from "react";
import NavLink from "@/app/(admin)/_components/navLink";
import Logo, { LOGO_SIZE } from "@/components/logo";

export default function TopNav() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu on window resize if the width is larger than 768px (md breakpoint)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="border-b border-b-violet-500/20 px-4 py-4 flex justify-between items-center">
      <div className="uppercase hidden sm:flex">
        <p>{user?.username}</p>
      </div>
      <div className=" sm:hidden block">
        <Logo
          size={LOGO_SIZE.BIG}
          width={80}
          height={80}
          className={"w-full h-full"}
        />
      </div>
      <div className="flex gap-2">
        <ThemeToggle />
        <Button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex sm:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <Menu />
        </Button>

        <div className="hidden sm:flex">
          <SignOutForm />
        </div>
      </div>
      {isMenuOpen && <OverlayMenu onClose={() => setIsMenuOpen(false)} />}
    </div>
  );
}

function OverlayMenu({ onClose }: { onClose: () => void }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Delay to allow animation to finish
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-20 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />
      <div
        className={`fixed top-0 left-0 w-full h-full bg-background z-30 p-4 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center">
          <SignOutForm />
          <Button
            onClick={handleClose}
            className="mb-4 flex items-center gap-2"
            aria-label="Close menu"
          >
            <X />
          </Button>
        </div>
        <div>
          <ul className="flex w-full flex-col h-full mt-8 gap-4">
            <li>
              <NavLink
                href={"/dashboard"}
                icon={<Home />}
                text={"Home"}
                onClick={handleClose}
              />
            </li>
            <li>
              <NavLink
                href={"/dashboard/projects"}
                icon={<FolderKanban />}
                text={"Projects"}
                onClick={handleClose}
              />
            </li>
            <li>
              <NavLink
                href={"/dashboard/connections"}
                icon={<Cable />}
                text={"Connections"}
                onClick={handleClose}
              />
            </li>
            <li>
              <NavLink
                href={"/dashboard/handbook"}
                icon={<BookOpen />}
                text={"Handbook"}
                onClick={handleClose}
              />
            </li>
            <li>
              <NavLink
                href={"/dashboard/challenges"}
                icon={<Flag />}
                text={"Challenges"}
                onClick={handleClose}
              />
            </li>
            <li>
              <NavLink
                href={"/dashboard/settings"}
                icon={<Settings />}
                text={"Settings"}
                onClick={handleClose}
              />
            </li>
            <li className="mt-auto">
              <NavLink
                href={"/dashboard/profile"}
                icon={<UserCircle />}
                text={"Profile"}
                onClick={handleClose}
              />
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
