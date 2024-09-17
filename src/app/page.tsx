import HeroImage from "@/components/heroImage";
import NavBar from "@/components/navBar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      <div className="flex flex-col items-center justify-center mt-24 md:mt-16 px-4 sm:px-6 md:px-12 lg:px-24">
        <h1 className="text-4xl sm:text-5xl md:text-6xl max-w-3xl font-bold bg-gradient-to-l from-violet-400 to-violet-700 inline-block text-transparent bg-clip-text text-center mb-4">
          Transform Your SQL Skills with Live Projects
        </h1>
        <p className="text-sm sm:text-lg md:text-xl max-w-3xl text-center text-gray-400 mb-8">
          Sign in, create and manage your own databases, and share your work
          with the community. Experience SQL like never before with hands-on
          projects and real-time interactions.
        </p>
        <ul className={" gap-4 flex md:hidden items-center mb-8"}>
          <li>
            <Button asChild className={"w-full"}>
              <Link href={"/signup"}>SIGN UP</Link>
            </Button>
          </li>
          <li className={"text-gray-600"}>Or</li>
          <li>
            <Button asChild>
              <Link href={"/signin"}>SIGN IN</Link>
            </Button>
          </li>
        </ul>
        <HeroImage />
      </div>
    </div>
  );
}
