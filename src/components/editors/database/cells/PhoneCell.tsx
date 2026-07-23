import { useState } from "react";

export default function PhoneCell({
  value,
  onSave,
}: {
  value: string | null;
  onSave: (value: string) => void;
}) {
  const [draft, setDraft] = useState(value ?? "");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSave(draft);
    } else if (e.key === "Escape") {
      setDraft(value ?? "");
    }
  };

  return (
    <div className="flex items-center">
      <input
        type="tel"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => onSave(draft)}
        onKeyDown={handleKeyDown}
        placeholder="+1 (555) 000-0000"
        className="w-full bg-transparent text-sm focus:outline-none"
      />
    </div>
  );
}
