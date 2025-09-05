import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useState } from "react";
import JournalSidebarContent from "./JournalSidebarContent";
import { ChevronUp } from "lucide-react";

export default function JournalSidebar({
  setIsEntryOpen,
}: {
  setIsEntryOpen: (isOpen: boolean) => void;
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <div className="hidden w-64 flex-col rounded-lg bg-white lg:block dark:bg-gray-800">
        {/* Sidebar Header */}
        <JournalSidebarContent
          setIsEntryOpen={setIsEntryOpen}
          setIsDrawerOpen={setIsDrawerOpen}
        />
      </div>
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed right-4 bottom-4 z-50 shadow-lg lg:hidden"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </DrawerTrigger>

        <DrawerContent className="flex h-[85vh] flex-col bg-white dark:bg-gray-800">
          <DrawerHeader className="flex-shrink-0 text-left">
            <DrawerTitle>Your Entries</DrawerTitle>
            <DrawerDescription>
              Browse and search through your journal entries
            </DrawerDescription>
          </DrawerHeader>

          <div className="min-h-0 flex-1">
            <JournalSidebarContent
              setIsEntryOpen={setIsEntryOpen}
              setIsDrawerOpen={setIsDrawerOpen}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
