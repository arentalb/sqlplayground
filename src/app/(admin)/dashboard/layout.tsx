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
    <div className="overflow-visible max-h-screen h-screen gap-2 flex relative">
      <SideNav />

      <div className="w-full border-l border-l-violet-500/20 relative ">
        <TopNav />
        <div>{children}</div>
      </div>
    </div>
  );
}