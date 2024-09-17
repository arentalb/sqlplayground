"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function HeroImage() {
  const { theme, resolvedTheme } = useTheme();
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (theme) {
      setIsThemeLoaded(true);
    }
  }, [theme]);

  return (
    <div
      className={`relative border-2 transparent-bottom border-violet-600 rounded-md mb-4 mt-8 w-full max-w-screen-xl h-auto ${
        imageLoaded
          ? "opacity-100 transition-opacity duration-500"
          : "opacity-0"
      }`}
    >
      {!isThemeLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-md"></div>
      )}
      {isThemeLoaded && (
        <Image
          src={resolvedTheme === "dark" ? "/hero-dark.png" : "/hero-light.png"}
          alt={"Logo"}
          className={`object-cover rounded-md ${
            imageLoaded
              ? "opacity-100 transition-opacity duration-500"
              : "opacity-0"
          }`}
          layout="responsive"
          width={1150}
          height={150}
          onLoadingComplete={() => setImageLoaded(true)}
        />
      )}
    </div>
  );
}
