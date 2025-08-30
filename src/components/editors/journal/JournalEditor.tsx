import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function JournalEditor() {
  const [entries] = useState([
    { id: 1, date: "2025-08-01", title: "First Entry" },
    { id: 2, date: "2025-08-15", title: "Mid August Thoughts" },
    { id: 3, date: "2025-08-30", title: "End of Month Reflection" },
  ]);

  return (
    <div className="flex h-screen gap-4 p-4">
      {/* Journal writing area */}
      <Card className="flex flex-1 flex-col">
        <CardContent className="flex flex-1 flex-col p-4">
          <textarea
            placeholder="Start writing your journal..."
            className="w-full flex-1 resize-none border-none text-base focus:ring-0 focus:outline-none"
          />
          <div className="mt-2 flex justify-end">
            <Button>Save Entry</Button>
          </div>
        </CardContent>
      </Card>

      {/* Timeline sidebar */}
      <Card className="w-64 overflow-y-auto">
        <CardContent className="space-y-4 p-4">
          <h2 className="mb-2 text-lg font-semibold">Timeline</h2>
          <div className="space-y-3">
            {entries.map((entry) => (
              <div key={entry.id} className="border-l-2 border-gray-300 pl-3">
                <p className="text-sm text-gray-500">{entry.date}</p>
                <p className="font-medium">{entry.title}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
