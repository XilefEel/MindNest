import { DbSelectOption } from "@/lib/types/database";
import { useActiveBackgroundId } from "@/stores/useNestStore";

export default function SelectOptionPill({
  option,
}: {
  option: DbSelectOption;
}) {
  const activeBackgroundId = useActiveBackgroundId();

  return (
    <span
      style={{
        backgroundColor: activeBackgroundId
          ? `${option.color}`
          : `${option.color}30`,
        color: activeBackgroundId ? "#ffffff" : option.color,
        border: `1px solid ${option.color}`,
      }}
      className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
    >
      {option.label}
    </span>
  );
}
