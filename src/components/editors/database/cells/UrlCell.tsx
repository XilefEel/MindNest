import { useState } from "react";

export default function LinkCell({
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
        type="url"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => onSave(draft)}
        onKeyDown={handleKeyDown}
        placeholder="https://example.com"
        className="w-full bg-transparent text-sm focus:outline-none"
      />
    </div>
  );
}
