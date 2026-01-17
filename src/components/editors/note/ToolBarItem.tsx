// import BaseToolTip from "@/components/BaseToolTip";

// export default function ToolBarItem({
//   type,
//   onFormat,
//   Icon,
//   label,
// }: {
//   type?: string;
//   onFormat?: (type: string) => void;
//   Icon: any;
//   label: string;
// }) {
//   return (
//     <BaseToolTip label={label}>
//       <button
//         value={type}
//         aria-label={label}
//         className="cursor-pointer rounded-lg p-2 transition-all duration-200 hover:text-teal-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-teal-300"
//         onClick={() => onFormat?.(type || "")}
//       >
//         <Icon className="size-4" />
//       </button>
//     </BaseToolTip>
//   );
// }
