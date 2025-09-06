type DummyImage = {
  id: number;
  file_path: string;
  width: number;
  height: number;
  title: string;
};

const aspectRatios = [
  [16, 9],
  [4, 3],
  [3, 2],
  [3, 4],
  [2, 3],
  [9, 16],
  [1, 1],
];

export const generateDummyImages = (count: number): DummyImage[] => {
  return Array.from({ length: count }).map((_, i) => {
    const [wRatio, hRatio] =
      aspectRatios[Math.floor(Math.random() * aspectRatios.length)];
    const base = 400 + Math.floor(Math.random() * 200);
    const width = base;
    const height = Math.round((base * hRatio) / wRatio);

    return {
      id: i,
      file_path: `https://picsum.photos/seed/${i}/${width}/${height}`,
      width,
      height,
      title: `Image ${i + 1}`,
    };
  });
};

const dummyImages = generateDummyImages(20);

export default function GalleryEditor() {
  return (
    <div className="p-4">
      <h1 className="mb-4 text-xl font-bold">Gallery View</h1>

      <div className="columns-2 gap-4 sm:columns-3 md:columns-4 lg:columns-5">
        {dummyImages.map((img) => (
          <div key={img.id} className="mb-4 break-inside-avoid">
            <img
              src={img.file_path}
              alt={img.title}
              className="w-full rounded-lg shadow-md transition hover:opacity-90"
            />
            <p className="mt-1 text-sm text-gray-600">{img.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
