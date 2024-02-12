"use client";
import Gallery, { RenderImageProps } from "react-photo-gallery";
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

function Photo(props: RenderImageProps) {
  const { index, photo, margin, top, left } = props;

  return (
    <Image
      key={index}
      src={photo.src}
      alt={photo.alt ?? ""}
      width={photo.width}
      height={photo.height}
      loading="lazy"
      className="object-cover"
      style={{
        margin,
        display: "block",
        top,
        left,
      }}
    />
  );
}

function ImageGallery(props: ImageGalleryProps) {
  const { images } = props;

  return (
    <Gallery photos={images} direction="row" margin={8} renderImage={Photo} />
  );
}

export { ImageGallery };
