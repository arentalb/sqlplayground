import Image from "next/image";

export enum LOGO_SIZE {
  BIG = 0,
  SMALL = 1,
}

export default function Logo({ size = LOGO_SIZE.BIG }: { size: LOGO_SIZE }) {
  return (
    <div>
      <Image
        src={"/logo-full.svg"}
        alt={"Big Logo"}
        width={150}
        height={150}
        priority={size === LOGO_SIZE.BIG}
        style={{ display: size === LOGO_SIZE.BIG ? "block" : "none" }}
      />
      <Image
        src={"/logo.svg"}
        alt={"Small Logo"}
        width={150}
        height={150}
        priority={size === LOGO_SIZE.SMALL}
        style={{ display: size === LOGO_SIZE.SMALL ? "block" : "none" }}
      />
    </div>
  );
}
