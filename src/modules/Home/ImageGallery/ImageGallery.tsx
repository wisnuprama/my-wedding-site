"use client";
import Gallery, { GalleryI, RenderImageProps } from "react-photo-gallery";
import Image, { StaticImageData } from "next/image";
import { memo } from "react";

type ImageItem = {
  src: StaticImageData;
  alt: string;
  width: number;
  height: number;
};

const TypedGallery = Gallery as unknown as GalleryI<ImageItem>;

export type ImageGalleryProps = {
  images: ImageItem[];
};

function Photo(props: RenderImageProps<ImageItem>) {
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
        placeholder="blur"
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
    <TypedGallery
      // @ts-expect-error to support NextJS Image
      photos={images}
      direction="row"
      margin={4}
      renderImage={Photo}
    />
  );
}

const ImageGallery = memo(InnerImageGallery);

export { ImageGallery };

export default ImageGallery;
