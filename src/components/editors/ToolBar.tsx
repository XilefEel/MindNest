import {
  Bold,
  Code,
  Image,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Smile,
  Table2,
  Type,
  Underline,
  Undo2,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

export default function ToolBar() {
  return (
    <ToggleGroup type="multiple">
      <ToggleGroupItem
        value="undo"
        aria-label="Undo"
        className="cursor-pointer transition-all duration-200 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-300"
      >
        <Undo2 className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="redo"
        aria-label="Redo"
        className="cursor-pointer transition-all duration-200 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-300"
      >
        <Redo2 className="size-4" />
      </ToggleGroupItem>

      <ToggleGroupItem
        value="bold"
        aria-label="Bold"
        className="cursor-pointer transition-all duration-200 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-300"
      >
        <Bold className="size-4" />
      </ToggleGroupItem>

      <ToggleGroupItem
        value="italic"
        aria-label="Italic"
        className="cursor-pointer transition-all duration-200 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-300"
      >
        <Italic className="size-4" />
      </ToggleGroupItem>

      <ToggleGroupItem
        value="strikethrough"
        aria-label="Strikethrough"
        className="cursor-pointer transition-all duration-200 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-300"
      >
        <Underline className="size-4" />
      </ToggleGroupItem>

      <ToggleGroupItem
        value="code"
        aria-label="Inline Code"
        className="cursor-pointer transition-all duration-200 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-300"
      >
        <Code className="size-4" />
      </ToggleGroupItem>

      <ToggleGroupItem
        value="blockquote"
        aria-label="Blockquote"
        className="cursor-pointer transition-all duration-200 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-300"
      >
        <Quote className="size-4" />
      </ToggleGroupItem>

      <ToggleGroupItem
        value="ul"
        aria-label="Unordered List"
        className="cursor-pointer transition-all duration-200 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-300"
      >
        <List className="size-4" />
      </ToggleGroupItem>

      <ToggleGroupItem
        value="ol"
        aria-label="Ordered List"
        className="cursor-pointer transition-all duration-200 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-300"
      >
        <ListOrdered className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="h1"
        aria-label="Heading 1"
        className="cursor-pointer transition-all duration-200 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-300"
      >
        <Type className="h-4 w-4" />
      </ToggleGroupItem>

      <ToggleGroupItem
        value="link"
        aria-label="Insert Link"
        className="cursor-pointer transition-all duration-200 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-300"
      >
        <Link className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="image"
        aria-label="Insert Image"
        className="cursor-pointer transition-all duration-200 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-300"
      >
        <Image className="h-4 w-4" />
      </ToggleGroupItem>

      <ToggleGroupItem
        value="table"
        aria-label="Table"
        className="cursor-pointer transition-all duration-200 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-300"
      >
        <Table2 className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="emoji"
        aria-label="Emoji"
        className="cursor-pointer transition-all duration-200 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus-visible:ring-blue-300"
      >
        <Smile className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
