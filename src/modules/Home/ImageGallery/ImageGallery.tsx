"use client";
import Gallery, { RenderImageProps } from "react-photo-gallery";
import Image from "next/image";
import { memo } from "react";

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
  const { index, photo, margin, top, left, direction, onClick } = props;

  return (
    <div
      style={{
        margin,
        display: "block",
        position: direction === "column" ? "absolute" : "relative",
        top,
        left,
        width: photo.width,
        height: photo.height,
      }}
    >
      <Image
        key={index}
        src={photo.src}
        alt={photo.alt ?? ""}
        width={photo.width}
        height={photo.height}
        loading="lazy"
        className="object-cover w-full h-full rounded-lg"
        onClick={(event) => {
          onClick?.(event, { ...props, index });
        }}
      />
    </div>
  );
}

function InnerImageGallery(props: ImageGalleryProps) {
  const { images } = props;

  return (
    <Gallery photos={images} direction="row" margin={4} renderImage={Photo} />
  );
}

const ImageGallery = memo(InnerImageGallery);

export { ImageGallery };
