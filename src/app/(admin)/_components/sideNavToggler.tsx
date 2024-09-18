import { Dispatch, SetStateAction } from "react";
import { PanelLeftOpen, PanelRightOpen } from "lucide-react";

export default function SideNavToggle({
  isOpen,
  setIsOpen,
  className,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  className?: string;
}) {
  return (
    <div className={className}>
      {isOpen ? (
        <button onClick={() => setIsOpen(false)}>
          <PanelRightOpen />
        </button>
      ) : (
        <button onClick={() => setIsOpen(true)}>
          <PanelLeftOpen />
        </button>
      )}
    </div>
  );
}
