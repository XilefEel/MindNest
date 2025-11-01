import { NestlingType } from "@/lib/types/nestling";
import { getNestlingIcon } from "@/lib/utils/nestlings";

export default function NestlingTitle({
  title,
  setTitle,
  nestlingType,
}: {
  title: string;
  setTitle: (title: string) => void;
  nestlingType: NestlingType;
}) {
  const Icon = getNestlingIcon(nestlingType);
  return (
    <div className="flex flex-row items-center gap-3">
      <Icon className="size-8" />
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full min-w-0 resize-none bg-transparent text-3xl font-bold outline-none"
        placeholder="Title..."
      />
    </div>
  );
}
