import { save } from "@tauri-apps/plugin-dialog";
import { writeTextFile } from "@tauri-apps/plugin-fs";
import { toast } from "@/lib/utils/toast";
import { Bookmark } from "../types/bookmark";

export const exportBookmarksToJson = async (
  bookmarks: Bookmark[],
  title: string,
) => {
  const data = {
    exported_at: new Date().toISOString(),
    nestling: title,
    bookmarks: bookmarks.map((b) => ({
      url: b.url,
      title: b.title,
      description: b.description,
      image_url: b.imageUrl,
      is_favorite: b.isFavorite,
      created_at: b.createdAt,
    })),
  };

  try {
    const filePath = await save({
      defaultPath: `bookmarks-${title}.json`,
      filters: [{ name: "JSON", extensions: ["json"] }],
    });

    if (filePath) {
      await writeTextFile(filePath, JSON.stringify(data, null, 2));
      toast.success("Bookmarks exported!");
    }
  } catch (error) {
    console.error("Error exporting bookmarks: ", error);
    toast.error("Failed to export bookmarks");
  }
};
