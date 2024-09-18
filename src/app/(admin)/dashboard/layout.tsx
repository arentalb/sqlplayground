import { getAuth } from "@/lib/auth/getAuth";
import { redirect } from "next/navigation";
import SideNav from "@/app/(admin)/_components/sideNav";
import TopNav from "@/app/(admin)/_components/topNav";

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
    <div className={"max-h-screen h-screen gap-2 flex"}>
      <div className={"w-1/6 "}>
        <SideNav />
      </div>
      <div className={"w-5/6 border-l border-l-violet-500/20"}>
        <TopNav />
        <div>{children}</div>
      </div>
    </div>
  );
}
