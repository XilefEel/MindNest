import TextCell from "./cells/TextCell";
import NumberCell from "./cells/NumberCell";
import CheckboxCell from "./cells/CheckboxCell";
import { DbCell, DbColumn, DbRow } from "@/lib/types/database";
import { format } from "date-fns";

export default function DatabaseCell({
  column,
  row,
  cell,
  onSave,
}: {
  column: DbColumn;
  row: DbRow;
  cell: DbCell | undefined;
  onSave: (value: string | null) => void;
}) {
  switch (column.columnType) {
    case "text":
      return <TextCell value={cell?.value ?? null} onSave={onSave} />;

    case "number":
      return <NumberCell value={cell?.value ?? null} onSave={onSave} />;

    case "checkbox":
      return <CheckboxCell value={cell?.value ?? null} onSave={onSave} />;

    case "created_at":
      return (
        <div className="text-muted-foreground flex items-center text-sm">
          {format(new Date(row.createdAt), "MMM d, yyyy")}
        </div>
      );

    case "last_modified":
      return (
        <div className="text-muted-foreground flex items-center text-sm">
          {format(new Date(row.updatedAt), "MMM d, yyyy")}
        </div>
      );

    default:
      return null;
  }
}
