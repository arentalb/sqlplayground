import { getAuth } from "@/lib/auth/getAuth";
import SignOutForm from "@/components/forms/signOutForm";
import ThemeToggle from "@/components/themeToggle";

export default async function TopNav() {
  const { user } = await getAuth();
  return (
    <div
      className={
        "border-b border-b-violet-500/20 px-4 py-4 flex justify-between items-center"
      }
    >
      <div className={" "}>
        <p className={"uppercase"}> {user?.username}</p>
        <p className={"text-xs text-gray-600"}> {user?.email}</p>
      </div>
      <div className={"flex gap-2"}>
        <ThemeToggle />
        <SignOutForm />
      </div>
    </div>
  );
}
