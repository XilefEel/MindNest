import { useCurrentEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";

export default function CustomBubbleMenu() {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <BubbleMenu editor={editor}>
      <button onClick={() => editor.chain().focus().toggleBold().run()}>
        Bold
      </button>
    </BubbleMenu>
  );
}
