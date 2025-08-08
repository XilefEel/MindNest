import * as ContextMenu from "@radix-ui/react-context-menu";
import { ContextTarget } from "../nests/Sidebar";

export default function SidebarContextMenu({
  children,
  contextTarget,
  setContextTarget,
}: {
  children: React.ReactNode;
  contextTarget: ContextTarget;
  setContextTarget: (target: ContextTarget) => void;
}) {
  return (
    <ContextMenu.Root
      onOpenChange={(open) => {
        if (!open) setContextTarget(null); // Reset on menu close
      }}
    >
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>

      {/* We'll add the menu content next */}
    </ContextMenu.Root>
  );
}
