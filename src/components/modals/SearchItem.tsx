import { Nestling } from "@/lib/types/nestling";
import { findFolderPath } from "@/lib/utils/folders";
import { getNestlingIcon } from "@/lib/utils/nestlings";
import { useNestlingStore, useNestlingTags } from "@/stores/useNestlingStore";
import { Folder } from "lucide-react";
import { NestlingTag } from "../editors/NestlingTag";

export default function SearchItem({ nestling }: { nestling: Nestling }) {
  const NestlingIcon = getNestlingIcon(nestling.nestlingType);
  const nestlingTags = useNestlingTags(nestling.id);
  const { folders } = useNestlingStore();
  return (
    <>
      <div className="flex items-center gap-1">
        <div className="flex w-6 items-center justify-center">
          {nestling.icon ? <p>{nestling.icon}</p> : <NestlingIcon />}
        </div>

        <span>{nestling.title}</span>
      </div>

      <div className="flex flex-1 items-center gap-1 text-gray-500 dark:text-gray-400">
        {nestlingTags.slice(0, 3).map((tag) => (
          <NestlingTag key={tag.id} tag={tag} />
        ))}
        {nestlingTags.length > 3 && (
          <span className="text-xs tracking-widest">
            ... +{nestlingTags.length - 3}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
        <Folder />
        <span>{findFolderPath(nestling.folderId, folders) || "No Folder"}</span>
      </div>
    </>
  );
}
