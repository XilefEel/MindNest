import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Image,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Smile,
  Strikethrough,
  Table2,
  Undo2,
} from "lucide-react";
import { ToggleGroup } from "../ui/toggle-group";
import ToolBarItem from "./ToolBarItem";

export default function ToolBar({
  onFormat,
}: {
  onFormat: (type: string) => void;
}) {
  return (
    <ToggleGroup
      type="multiple"
      className="flex w-5/6 overflow-x-scroll md:overflow-x-hidden"
    >
      <ToolBarItem type="undo" onFormat={onFormat} Icon={Undo2} label="Undo" />
      <ToolBarItem type="redo" onFormat={onFormat} Icon={Redo2} label="Redo" />
      <ToolBarItem type="bold" onFormat={onFormat} Icon={Bold} label="Bold" />
      <ToolBarItem
        type="italic"
        onFormat={onFormat}
        Icon={Italic}
        label="Italic"
      />
      <ToolBarItem
        type="strikethrough"
        onFormat={onFormat}
        Icon={Strikethrough}
        label="Strikethrough"
      />
      <ToolBarItem
        type="ul"
        onFormat={onFormat}
        Icon={List}
        label="Unordered List"
      />
      <ToolBarItem
        type="ol"
        onFormat={onFormat}
        Icon={ListOrdered}
        label="Ordered List"
      />
      <ToolBarItem
        type="h1"
        onFormat={onFormat}
        Icon={Heading1}
        label="Heading 1"
      />
      <ToolBarItem
        type="h2"
        onFormat={onFormat}
        Icon={Heading2}
        label="Heading 2"
      />
      <ToolBarItem
        type="h3"
        onFormat={onFormat}
        Icon={Heading3}
        label="Heading 3"
      />
      <ToolBarItem type="code" onFormat={onFormat} Icon={Code} label="Code" />
      <ToolBarItem
        type="blockquote"
        onFormat={onFormat}
        Icon={Quote}
        label="Quote"
      />
      <ToolBarItem type="link" onFormat={onFormat} Icon={Link} label="Link" />
      <ToolBarItem
        type="table"
        onFormat={onFormat}
        Icon={Table2}
        label="Table"
      />
      <ToolBarItem
        type="image"
        onFormat={onFormat}
        Icon={Image}
        label="Image"
      />

      <ToolBarItem
        type="emoji"
        onFormat={onFormat}
        Icon={Smile}
        label="Emoji"
      />
    </ToggleGroup>
  );
}
