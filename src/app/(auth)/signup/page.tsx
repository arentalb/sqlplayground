import SignUpForm from "@/components/forms/signUpForm";
import NavBar from "@/components/navBar";
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
        <h1 className={"text-4xl text-violet-500 mb-4"}>Become a SQL Guru!</h1>
        <p className={"mb-12 text-center text-gray-600 text-sm"}>
          Join a community of SQL experts mastering real-time projects and
          challenges.
        </p>
        <div className={"min-w-96 "}>
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
