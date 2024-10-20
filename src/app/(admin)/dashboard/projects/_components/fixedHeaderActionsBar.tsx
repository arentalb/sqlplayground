import React from "react";

export default function FixedHeaderActionsBar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4   z-20 items-center  bg-background  sticky top-0">
      <div className={"mx-10 border-b w-full  pt-6 pb-4  flex items-center"}>
        {children}
      </div>
    </div>
  );
}
