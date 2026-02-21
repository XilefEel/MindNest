import { useFolderModal, useNestlingModal } from "@/stores/useModalStore";
import { Plus } from "lucide-react";
import { useMemo } from "react";

const GREETINGS = [
  "Welcome back 👋",
  "Good to see you! 👋",
  "Hello again! 👋",
  "Ready to be productive? 💪",
  "Ready to create? ✨",
  "Let's get things done! ✨",
  "Another day, another win! 🏆",
  "Time to build 💡",
  "Focus mode on 🎯",
  "Powered up ⚡",
  "Let's make it happen! 🚀",
  "You've got this! 💪",
  "Time to shine ⭐",
  "Ready, set, create! 🎨",
  "Let's do this! 🔥",
  "Back in action! ⚡",
  "Ideas incoming! 💭",
  "Let's crush it! 💥",
  "The grind begins! ⚙️",
  "Level up time! 📈",
];

const SUBTEXTS = [
  "Pick up where you left off or start something new.",
  "Your nest is ready and waiting.",
  "What will you create today?",
  "Every great idea starts somewhere.",
  "Your productivity hub awaits.",
  "Time to make progress on your goals.",
  "Let's build something amazing.",
  "Your next big idea starts here.",
  "Every project begins with a single step.",
  "Make today productive and purposeful.",
  "Turn your thoughts into reality.",
  "Small steps lead to big achievements.",
  "Your nest, your rules.",
  "Organize your chaos, one nestling at a time.",
  "Dream it, plan it, build it.",
  "Today's work shapes tomorrow's success.",
  "Clarity starts with organization.",
  "Create the nest you imagine.",
  "Progress over perfection.",
  "Your ideas deserve a nest.",
];

export default function Header({ nestId }: { nestId: number }) {
  const { openNestlingModal } = useNestlingModal();
  const { openFolderModal } = useFolderModal();

  const greeting = useMemo(
    () => GREETINGS[Math.floor(Math.random() * GREETINGS.length)],
    [],
  );
  const subtext = useMemo(
    () => SUBTEXTS[Math.floor(Math.random() * SUBTEXTS.length)],
    [],
  );

  return (
    <header className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
      <div>
        <h1 className="relative inline-block text-2xl font-bold tracking-tight text-slate-900 md:text-3xl dark:text-white">
          {greeting}
          <span className="absolute -bottom-2 left-0 h-1 w-full rounded-full bg-gradient-to-r from-teal-500 to-teal-600 dark:from-teal-300 dark:to-teal-400"></span>
        </h1>
        <p className="mt-3 text-sm text-slate-600 md:text-base dark:text-slate-400">
          {subtext}
        </p>
      </div>

      <div className="flex gap-3 text-sm font-semibold md:text-base">
        <button
          onClick={() => openNestlingModal(nestId)}
          className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 px-3.5 py-1.5 text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
        >
          <Plus className="size-4" /> Nestling
        </button>

        <button
          onClick={() => openFolderModal(nestId)}
          className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 px-3.5 py-1.5 text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
        >
          <Plus className="size-4" /> Folder
        </button>
      </div>
    </header>
  );
}
