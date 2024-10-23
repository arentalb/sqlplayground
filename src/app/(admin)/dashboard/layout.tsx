import { getAuth } from "@/lib/auth/getAuth";
import { redirect } from "next/navigation";
import TopNav from "@/app/(admin)/_components/topNav";
import SideNav from "@/app/(admin)/_components/sideNav";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getAuth();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="md:overflow-hidden md:max-h-screen md:h-screen gap-2 flex relative">
      <SideNav />

      <div className="w-full  flex flex-col border-l border-l-violet-500/20 relative md:max-h-screen md:h-screen">
        <TopNav />
        {children}
        {/*<div className="flex flex-col h-full overflow-hidden  ">{children}</div>*/}
      </div>
    </div>
  );
}
