import { Star, Trash2 } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import ImageContextMenu from "@/components/context-menu/ImageContextMenu";
import { cn } from "@/lib/utils/general";

export default function ImageCard({
  imageProps,
  photo,
  handleImageDelete,
  handleAddToFavorites,
}: {
  imageProps: React.ImgHTMLAttributes<HTMLImageElement>;
  photo: {
    id: number;
    title: string;
    src: string;
    width: number;
    height: number;
    isFavorite: boolean;
  };
  handleImageDelete: (id: number) => Promise<void>;
  handleAddToFavorites: (photo: any) => Promise<void>;
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
    <ImageContextMenu imageId={photo.id}>
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
          <div className="absolute top-2 left-2">
            <button
              className={cn(
                "rounded-full p-1.5 shadow transition",
                photo.isFavorite
                  ? "bg-yellow-400 text-white hover:bg-yellow-500"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300",
              )}
              onClick={(e) => {
                e.stopPropagation();
                handleAddToFavorites(photo);
              }}
            >
              <Star
                size={16}
                fill={photo.isFavorite ? "currentColor" : "none"}
              />
            </button>
          </div>
          <div className="absolute top-2 right-2">
            <button
              className="rounded-full bg-red-500 p-1.5 text-white shadow transition hover:bg-red-600"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Removing image:", photo.id);
                handleImageDelete(photo.id);
              }}
            >
              <Trash2 size={16} />
            </button>
          </div>
          <div className="absolute right-2 bottom-2 left-2 truncate text-sm text-white">
            {photo.title}
          </div>
        </div>
      </div>
    </ImageContextMenu>
  );
}
