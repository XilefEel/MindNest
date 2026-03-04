import { useState } from "react";
import { useNestlings, useNestlingTagsMap } from "@/stores/useNestlingStore";

export function useNestlingSearch() {
  const nestlings = useNestlings();
  const nestlingTagsMap = useNestlingTagsMap();

  const [searchQuery, setSearchQuery] = useState("");
  const isTagSearch = searchQuery.startsWith("#") && searchQuery.length > 1;
  const query = (
    isTagSearch ? searchQuery.slice(1) : searchQuery
  ).toLowerCase();

  const filteredNestlings = nestlings.filter((nestling) => {
    if (isTagSearch) {
      const nestlingTags = nestlingTagsMap[nestling.id] || [];
      return nestlingTags.some((tag) => tag.name.toLowerCase().includes(query));
    }
    return nestling.title.toLowerCase().includes(query);
  });

  return { searchQuery, setSearchQuery, filteredNestlings };
}
