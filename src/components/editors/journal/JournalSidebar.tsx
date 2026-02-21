// import { Button } from "@/components/ui/button";
// import {
//   Drawer,
//   DrawerContent,
//   DrawerDescription,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer";
// import { useState } from "react";
// import JournalSidebarContent from "./JournalSidebarContent";
// import { ChevronUp } from "lucide-react";
// import { useActiveBackgroundId } from "@/stores/useNestStore";
// import { cn } from "@/lib/utils/general";
//
// export default function JournalSidebar({
//   setIsEntryOpen,
// }: {
//   setIsEntryOpen: (isOpen: boolean) => void;
// }) {
//   const activeBackgroundId = useActiveBackgroundId();
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//
//   return (
//     <>
//       <div
//         className={cn(
//           "hidden w-64 flex-col rounded-lg bg-white lg:block dark:bg-gray-800",
//           activeBackgroundId && "bg-white/30 backdrop-blur-sm dark:bg-black/10",
//         )}
//       >
//         {/* Sidebar Header */}
//         <JournalSidebarContent
//           setIsEntryOpen={setIsEntryOpen}
//           setIsDrawerOpen={setIsDrawerOpen}
//         />
//       </div>
//       <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
//         <DrawerTrigger asChild>
//           <Button
//             variant="outline"
//             size="icon"
//             className="fixed right-4 bottom-4 z-50 shadow-lg lg:hidden"
//           >
//             <ChevronUp className="h-4 w-4" />
//           </Button>
//         </DrawerTrigger>
//
//         <DrawerContent
//           className={cn(
//             "flex h-[85vh] flex-col bg-white dark:bg-gray-800",
//             activeBackgroundId &&
//               "bg-white/50 backdrop-blur-sm dark:bg-black/30",
//           )}
//         >
//           <DrawerHeader className="flex-shrink-0 text-left">
//             <DrawerTitle>Your Entries</DrawerTitle>
//             <DrawerDescription>
//               Browse and search through your journal entries
//             </DrawerDescription>
//           </DrawerHeader>
//
//           <div className="min-h-0 flex-1">
//             <JournalSidebarContent
//               setIsEntryOpen={setIsEntryOpen}
//               setIsDrawerOpen={setIsDrawerOpen}
//             />
//           </div>
//         </DrawerContent>
//       </Drawer>
//     </>
//   );
// }
