import Image from "next/image";

export enum LOGO_SIZE {
  BIG = 0,
  SMALL = 1,
}

export default function Logo({
  size = LOGO_SIZE.BIG,
  width = 150,
  height = 150,
}: {
  size: LOGO_SIZE;
  className?: string;
  height?: number;
  width?: number;
}) {
  return (
    <div>
      <Image
        src={"/logo-full.svg"}
        alt={"Big Logo"}
        width={width}
        height={height}
        layout="fixed"
        priority={size === LOGO_SIZE.BIG}
        style={{ display: size === LOGO_SIZE.BIG ? "block" : "none" }}
      />
      <Image
        src={"/logo.svg"}
        alt={"Small Logo"}
        width={width}
        height={height}
        layout="fixed"
        priority={size === LOGO_SIZE.SMALL}
        style={{ display: size === LOGO_SIZE.SMALL ? "block" : "none" }}
      />
    </div>
  );
}
