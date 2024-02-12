"use client";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Image from "next/image";

type ImageItem = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type ImageGalleryProps = {
  images: ImageItem[];
};

function ImageGallery(props: ImageGalleryProps) {
  const { images } = props;

  return (
    <ResponsiveMasonry
      columnsCountBreakPoints={{ 350: 2, 750: 3, 900: 4, 1200: 4 }}
    >
      <Masonry>
        {images.map(({ alt, height, src, width }) => (
          <Image
            key={src}
            src={src}
            loading="lazy"
            className="w-full block p-2"
            alt={alt}
            width={width}
            height={height}
          />
        ))}
      </Masonry>
    </ResponsiveMasonry>
  );
}

export { ImageGallery };
