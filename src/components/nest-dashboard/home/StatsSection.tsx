import { useFolders, useNestlings, useTags } from "@/stores/useNestlingStore";
import { useBackgrounds, useMusic } from "@/stores/useNestStore";
import { useSettingsModal } from "@/stores/useModalStore";
import NestlingPopOver from "../../popovers/NestlingPopover";
import StatsCard from "./StatsCard";
import { Music, Image, FolderOpen, File, Tag } from "lucide-react";

export default function StatsSection() {
  const nestlings = useNestlings();
  const folders = useFolders();
  const tags = useTags();
  const backgrounds = useBackgrounds();
  const music = useMusic();
  const { setIsSettingsOpen } = useSettingsModal();

  const stats = [
    {
      label: "Nestlings",
      value: nestlings.length,
      Icon: File,
      color: "teal" as const,
      type: "popover" as const,
      popoverContent: <NestlingPopOver nestlings={nestlings} />,
    },
    {
      label: "Folders",
      value: folders.length,
      Icon: FolderOpen,
      color: "purple" as const,
    },
    {
      label: "Tags",
      value: tags.length,
      Icon: Tag,
      color: "blue" as const,
    },
    {
      label: "Backgrounds",
      value: backgrounds.length,
      Icon: Image,
      color: "amber" as const,
      type: "clickable" as const,
      onClick: () => setIsSettingsOpen(true, "nest", "background"),
    },
    {
      label: "Music",
      value: music.length,
      Icon: Music,
      color: "rose" as const,
      type: "clickable" as const,
      onClick: () => setIsSettingsOpen(true, "nest", "music"),
    },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-3 md:grid-cols-5">
      {stats.map((stat, i) => (
        <StatsCard key={i} {...stat} />
      ))}
    </section>
  );
}
