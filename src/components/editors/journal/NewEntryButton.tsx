// import AddJournalEntryModal from "@/components/modals/AddJournalEntryModal";
// import AddTemplateModal from "@/components/modals/TemplateModal";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useActiveNestling } from "@/stores/useNestlingStore";
// import { JournalTemplate } from "@/lib/types/journal";
// import { cn } from "@/lib/utils/general";
// import { useJournalActions, useTemplates } from "@/stores/useJournalStore";
// import { useActiveBackgroundId } from "@/stores/useNestStore";
// import { Plus, ChevronDown, Trash, Pencil } from "lucide-react";
// import { useEffect, useState } from "react";
//
// export function NewEntryButton({
//   setIsEntryOpen,
// }: {
//   setIsEntryOpen: (isOpen: boolean) => void;
// }) {
//   const activeNestling = useActiveNestling();
//   if (!activeNestling) return;
//
//   const activeBackgroundId = useActiveBackgroundId();
//   const templates = useTemplates();
//   const { useTemplate, getTemplates, deleteTemplate } = useJournalActions();
//
//   const [isAddTemplateOpen, setIsAddTemplateOpen] = useState(false);
//   const [isEditTemplateOpen, setIsEditTemplateOpen] = useState(false);
//   const [editingTemplate, setEditingTemplate] = useState<JournalTemplate>();
//
//   const handleDeleteTemplate = async (id: number) => {
//     try {
//       await deleteTemplate(id);
//       console.log("Entry deleted!");
//     } catch (error) {
//       console.error("Failed to delete entry:", error);
//     }
//   };
//
//   const handleEditTemplate = (template: JournalTemplate) => {
//     setEditingTemplate(template);
//     setIsEditTemplateOpen(true);
//   };
//
//   useEffect(() => {
//     getTemplates(activeNestling.id);
//   }, [getTemplates, activeNestling.id]);
//
//   return (
//     <div className="flex rounded-lg bg-teal-500 shadow-sm">
//       <AddJournalEntryModal
//         setActiveEntry={() => {
//           setIsEntryOpen(true);
//         }}
//       >
//         <Button className="flex items-center gap-1 rounded-l-lg rounded-r-none hover:bg-teal-600">
//           <Plus className="size-4" />
//           New Entry
//         </Button>
//       </AddJournalEntryModal>
//
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <button className="rounded-l-none rounded-r-lg px-2 hover:bg-teal-600">
//             <ChevronDown className="size-4" />
//           </button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent
//           className={cn(
//             "w-72 border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800",
//             activeBackgroundId &&
//               "border-0 bg-white/30 backdrop-blur-sm dark:bg-black/30",
//           )}
//           align="start"
//         >
//           <DropdownMenuLabel>Templates</DropdownMenuLabel>
//           <DropdownMenuGroup>
//             {templates.map((template: JournalTemplate) => (
//               <DropdownMenuItem
//                 key={template.id}
//                 onClick={() => {
//                   setIsEntryOpen(true);
//                   useTemplate(activeNestling.id, template);
//                 }}
//                 className="justify-between px-3 transition duration-200 hover:bg-teal-100 dark:hover:bg-gray-700"
//               >
//                 {template.name}
//                 <div className="flex">
//                   <div
//                     onClick={(e) => {
//                       e.preventDefault();
//                       e.stopPropagation();
//                       handleEditTemplate(template);
//                     }}
//                     className="rounded-lg p-2 transition-colors hover:bg-teal-100 hover:text-teal-500"
//                   >
//                     <Pencil className="size-3" />
//                   </div>
//                   <div
//                     onClick={(e) => {
//                       e.preventDefault();
//                       e.stopPropagation();
//                       handleDeleteTemplate(template.id);
//                     }}
//                     className="rounded-lg p-2 transition-colors hover:bg-red-100 hover:text-red-500"
//                   >
//                     <Trash className="size-3" />
//                   </div>
//                 </div>
//               </DropdownMenuItem>
//             ))}
//           </DropdownMenuGroup>
//           <DropdownMenuSeparator
//             className={cn(
//               "mx-2 bg-slate-200 dark:bg-gray-700",
//               activeBackgroundId && "bg-black/50 dark:bg-white/50",
//             )}
//           />
//           <AddTemplateModal
//             isOpen={isAddTemplateOpen}
//             setIsOpen={setIsAddTemplateOpen}
//           >
//             <DropdownMenuItem
//               onSelect={(e) => {
//                 e.preventDefault();
//               }}
//               className="text-gray-500 transition duration-200 hover:bg-teal-100 dark:text-gray-200 dark:hover:bg-gray-700"
//             >
//               <Plus className="size-4" /> New Template
//             </DropdownMenuItem>
//           </AddTemplateModal>
//         </DropdownMenuContent>
//       </DropdownMenu>
//
//       <AddTemplateModal
//         isOpen={isEditTemplateOpen}
//         setIsOpen={setIsEditTemplateOpen}
//         template={editingTemplate}
//       >
//         <div />
//       </AddTemplateModal>
//     </div>
//   );
// }
