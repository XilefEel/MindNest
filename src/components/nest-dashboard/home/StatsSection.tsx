import { useFolders, useNestlings } from "@/stores/useNestlingStore";
import { useBackgrounds, useMusic } from "@/stores/useNestStore";
import { useSettingsModal } from "@/stores/useModalStore";
import NestlingPopOver from "../../popovers/NestlingPopover";
import StatsCard from "./StatsCard";

export default function StatsSection() {
  const nestlings = useNestlings();
  const folders = useFolders();
  const backgrounds = useBackgrounds();
  const music = useMusic();
  const { setIsSettingsOpen } = useSettingsModal();

  const stats = [
    {
      label: "Nestlings",
      value: nestlings.length,
      icon: "🪺",
      type: "popover" as const,
      popoverContent: <NestlingPopOver nestlings={nestlings} />,
    },
    {
      label: "Folders",
      value: folders.length,
      icon: "📁",
    },
    {
      label: "Backgrounds",
      value: backgrounds.length,
      icon: "🖼️",
      type: "clickable" as const,
      onClick: () => setIsSettingsOpen(true, "nest", "background"),
    },
    {
      label: "Music",
      value: music.length,
      icon: "🎵",
      type: "clickable" as const,
      onClick: () => setIsSettingsOpen(true, "nest", "music"),
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-5 md:grid-cols-4">
      {stats.map((stat, i) => (
        <StatsCard key={i} {...stat} />
      ))}
    </section>
  );
}
