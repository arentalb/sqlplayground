import Image from "next/image";

export default function Logo() {
  return (
    <div>
      <Image src={"logo-full.svg"} alt={"Logo"} width={150} height={100} />
    </div>
  );
}
