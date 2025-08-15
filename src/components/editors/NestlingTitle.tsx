import TextareaAutosize from "react-textarea-autosize";
export default function NestlingTitle({
  title,
  setTitle,
}: {
  title: string;
  setTitle: (title: string) => void;
}) {
  return (
    <TextareaAutosize
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      className="w-full resize-none bg-transparent text-3xl font-bold outline-none"
      placeholder="Note title..."
    />
  );
}
