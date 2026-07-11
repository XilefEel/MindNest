import {
  Calendar,
  Clock,
  ClockPlus,
  Hash,
  SquareCheckBig,
  Tag,
  Type,
} from "lucide-react";

export const COLUMN_TYPES = [
  { value: "text", label: "Text", Icon: Type },
  { value: "number", label: "Number", Icon: Hash },
  { value: "checkbox", label: "Checkbox", Icon: SquareCheckBig },
  { value: "date", label: "Date", Icon: Calendar },
  { value: "select", label: "Select", Icon: Tag },
  { value: "created_at", label: "Created at", Icon: Clock },
  { value: "last_modified", label: "Last modified", Icon: ClockPlus },
];
