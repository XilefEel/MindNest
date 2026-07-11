import TextCell from "./cells/TextCell";
import NumberCell from "./cells/NumberCell";
import CheckboxCell from "./cells/CheckboxCell";
import { DbCell, DbColumn, DbRow } from "@/lib/types/database";
import { format } from "date-fns";
import DateCell from "./cells/DateCell";
import SelectCell from "./cells/SelectCell";
import { useDbActions } from "@/stores/useDatabaseStore";

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
  const { createColumnOption } = useDbActions();

  switch (column.columnType) {
    case "text":
      return <TextCell value={cell?.value ?? null} onSave={onSave} />;

    case "number":
      return <NumberCell value={cell?.value ?? null} onSave={onSave} />;

    case "checkbox":
      return <CheckboxCell value={cell?.value ?? null} onSave={onSave} />;

    case "date":
      return <DateCell value={cell?.value ?? null} onSave={onSave} />;

    case "select":
      return (
        <SelectCell
          value={cell?.value ?? null}
          options={column.options}
          onSave={onSave}
          onCreateOption={(label, color) =>
            createColumnOption(column.id, label, color)
          }
        />
      );

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
