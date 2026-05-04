import { cn } from "@/lib/utils/general";
import { useEffect, useRef, useState } from "react";

export default function TextCell({
  value,
  onSave,
}: {
  value: string | null;
  onSave: (value: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(value ?? "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  useEffect(() => {
    resetHeight();
  }, [content, editing]);

  const save = () => {
    setEditing(false);
    onSave(content);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      setContent(value ?? "");
      setEditing(false);
    }
  };

  return (
    <textarea
      ref={textareaRef}
      value={content}
      rows={1}
      readOnly={!editing}
      onClick={() => setEditing(true)}
      onChange={(e) => {
        setContent(e.target.value);
        resetHeight();
      }}
      onBlur={save}
      onKeyDown={handleKeyDown}
      autoComplete="off"
      autoCorrect="off"
      spellCheck={false}
      className={cn(
        "min-h-5 w-full resize-none bg-transparent text-sm focus:outline-none",
        editing ? "cursor-text" : "cursor-default",
      )}
    />
  );
}
