import { Photo } from "@/lib/types/gallery";
import { cn } from "@/lib/utils/general";
import { toast } from "@/lib/utils/toast";
import { useGalleryActions, useImages } from "@/stores/useGalleryStore";
import { useActiveNestling } from "@/stores/useNestlingStore";
import { convertFileSrc } from "@tauri-apps/api/core";
import {
  ChevronLeft,
  ChevronRight,
  LucideIcon,
  PanelBottomClose,
  PanelBottomOpen,
  Upload,
  XIcon,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { ColumnsPhotoAlbum, RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/columns.css";
import "react-photo-album/rows.css";
import { Lightbox } from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import ImageCard from "./ImageCard";

export default function ImageLayout({
  layoutMode,
}: {
  layoutMode: "row" | "column";
}) {
  const activeNestling = useActiveNestling();
  if (!activeNestling) return;

  const images = useImages();
  const { uploadImage } = useGalleryActions();

  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [index, setIndex] = useState(-1);

  const dropZoneRef = useRef<HTMLDivElement>(null);

  const PhotoLayout = layoutMode === "row" ? RowsPhotoAlbum : ColumnsPhotoAlbum;

  const photos: Photo[] = useMemo(
    () =>
      images.map((img) => ({
        id: img.id,
        src: convertFileSrc(img.filePath),
        title: img.title ?? "Untitled",
        description: img.description ?? "No Description",
        isFavorite: img.isFavorite!,
        width: img.width,
        height: img.height,
        createdAt: img.createdAt,
        updatedAt: img.updatedAt,
      })),
    [images],
  );

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (isUploading) return;

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      toast.error("Please drop image files only.");
      return;
    }

    setIsUploading(true);

    try {
      for (const file of imageFiles) {
        const uint8Array = new Uint8Array(await file.arrayBuffer());
        await uploadImage({
          nestlingId: activeNestling.id,
          file: { name: file.name, data: uint8Array },
        });
      }
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDropOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDropLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!dropZoneRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const LightboxIcon = ({
    icon: Icon,
    size = "size-6",
  }: {
    icon: LucideIcon;
    size?: string;
  }) => (
    <Icon
      className={cn(size, "text-gray-200 transition-colors hover:text-white")}
    />
  );

  return (
    <div
      ref={dropZoneRef}
      onDrop={handleDrop}
      onDragOver={handleDropOver}
      onDragLeave={handleDropLeave}
      className={cn(
        "inset-0 rounded-lg p-1",
        isDragOver && "outline-teal-500 outline-dashed",
      )}
    >
      {photos.length === 0 && !isUploading ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-500 dark:text-gray-400">
          <Upload className="mb-4 size-16" />
          <p className="text-base font-medium">No images yet.</p>
          <p className="text-sm">
            Click the upload button, or drag and drop an image here.
          </p>
        </div>
      ) : (
        <PhotoLayout
          columns={3}
          photos={photos}
          onClick={({ index: current }) => setIndex(current)}
          render={{
            image: (imageProps, { photo }) => (
              <ImageCard key={photo.id} imageProps={imageProps} photo={photo} />
            ),
          }}
        />
      )}

      <Lightbox
        index={index}
        slides={photos}
        plugins={[Thumbnails, Zoom]}
        controller={{
          disableSwipeNavigation: true,
        }}
        carousel={{
          preload: 7,
          padding: 0,
        }}
        styles={{
          thumbnailsContainer: { padding: 4 },
          thumbnail: { cursor: "default" },
        }}
        labels={{
          Previous: "",
          Next: "",
          Close: "",
          Thumbnails: "",
          "Hide thumbnails": "",
          "Show thumbnails": "",
          "Zoom in": "",
          "Zoom out": "",
        }}
        thumbnails={{
          showToggle: true,
          width: 60,
          border: 0,
          gap: 8,
        }}
        zoom={{
          maxZoomPixelRatio: 5,
          zoomInMultiplier: 1.5,
          minZoom: 0.5,
          scrollToZoom: true,
          doubleClickDelay: 250,
          wheelZoomDistanceFactor: 400,
        }}
        animation={{
          zoom: 200,
          swipe: 0,
        }}
        open={index >= 0}
        close={() => setIndex(-1)}
        render={{
          iconPrev: () => <LightboxIcon icon={ChevronLeft} size="size-10" />,
          iconNext: () => <LightboxIcon icon={ChevronRight} size="size-10" />,
          iconClose: () => <LightboxIcon icon={XIcon} />,
          iconThumbnailsVisible: () => <LightboxIcon icon={PanelBottomClose} />,
          iconThumbnailsHidden: () => <LightboxIcon icon={PanelBottomOpen} />,
          iconZoomIn: () => <LightboxIcon icon={ZoomIn} />,
          iconZoomOut: () => <LightboxIcon icon={ZoomOut} />,

          slideFooter: ({ slide }: { slide: any }) => (
            <div className="absolute inset-x-0 bottom-0 bg-black/50 p-1 text-center">
              <p className="text-sm font-semibold text-white">{slide.title}</p>
              <p className="text-xs text-white">{slide.description}</p>
            </div>
          ),
        }}
      />
    </div>
  );
}
