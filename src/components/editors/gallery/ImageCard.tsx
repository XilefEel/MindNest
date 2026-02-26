import { Star, Trash2 } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import ImageContextMenu from "@/components/context-menu/ImageContextMenu";
import { cn } from "@/lib/utils/general";
import { Photo } from "@/lib/types/gallery";

export default function ImageCard({
  imageProps,
  photo,
  handleDeleteImage,
  handleAddToFavorites,
}: {
  imageProps: React.ImgHTMLAttributes<HTMLImageElement>;
  photo: Photo;
  handleDeleteImage: (id: number) => Promise<void>;
  handleAddToFavorites: (id: number) => Promise<void>;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: photo.id.toString(),
      data: {
        type: "image",
        image: photo,
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0 : 1,
  };

  return (
    <ImageContextMenu
      imageId={photo.id}
      handleDeleteImage={handleDeleteImage}
      handleAddToFavorites={handleAddToFavorites}
    >
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={style}
        className="group relative cursor-grab overflow-hidden rounded-xl shadow-md hover:shadow-lg active:cursor-grabbing"
      >
        <img
          {...imageProps}
          className="h-full w-full transition-transform duration-300 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 transition-all duration-200 group-hover:opacity-100">
          <button
            onClick={() => handleAddToFavorites(photo.id)}
            className={cn(
              "absolute top-2 left-2 rounded-full p-2 shadow-md transition-colors",
              photo.isFavorite
                ? "bg-yellow-400 opacity-100"
                : "bg-white/80 text-gray-500 opacity-0 group-hover:opacity-100 hover:bg-yellow-50 hover:text-yellow-400 dark:bg-gray-900/80 dark:text-gray-400 dark:hover:bg-yellow-800 hover:dark:text-yellow-500",
            )}
          >
            <Star
              className={cn(
                "size-4 transition-all",
                photo.isFavorite ? "fill-white text-white" : "",
              )}
            />
          </button>

          <button
            onClick={() => handleDeleteImage(photo.id)}
            className={cn(
              "absolute top-2 right-2 rounded-full p-2 opacity-0 shadow-md transition-all group-hover:opacity-100",
              "bg-white/80 hover:bg-red-50 dark:bg-gray-900/80 dark:hover:bg-red-950",
              "text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400",
            )}
          >
            <Trash2 className="size-4" />
          </button>

          <div className="absolute right-2 bottom-2 left-2 truncate text-sm text-white">
            {photo.title}
          </div>
        </div>
      </div>
    </ImageContextMenu>
  );
}
