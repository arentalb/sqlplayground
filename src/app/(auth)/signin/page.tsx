import NavBar from "@/components/navBar";
import SignInForm from "@/components/forms/signInForm";
import { getAuth } from "@/lib/auth/getAuth";
import { redirect } from "next/navigation";

export default async function Page() {
  const { user } = await getAuth();
  if (user) {
    redirect("/");
  }
  return (
    <div className="flex flex-col min-h-screen ">
      <NavBar />
      <div className={"flex flex-col justify-center items-center mt-10 "}>
        <h1 className={"text-4xl text-violet-500 mb-4"}>
          Welcome Back, SQL Guru!
        </h1>
        <p className={"mb-12 text-center text-gray-600 text-sm"}>
          Your projects and challenges are waiting—jump right back in!
        </p>
        <div className={"min-w-96 "}>
          <SignInForm />
        </div>
      </div>
    </div>
  );
}
