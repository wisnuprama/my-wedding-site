"use client";
import Gallery, { GalleryI, RenderImageProps } from "react-photo-gallery";
import Image, { StaticImageData } from "next/image";
import Lightbox, { LightboxProps } from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { memo, useCallback, useContext, useState } from "react";
import { DisableScrollContext } from "@/components/DisableScroll/context";

type ImageItem = {
  src: string;
  static: StaticImageData;
  alt: string;
  width: number;
  height: number;
  type: "image";
};

const TypedGallery = Gallery as unknown as GalleryI<ImageItem>;

export type ImageGalleryProps = {
  images: ImageItem[];
};

const THUMBNAIL_IMAGE_QUALITY = 50;

function Photo(props: RenderImageProps<ImageItem>) {
  const { index, photo, margin, top, left, direction, onClick } = props;

  return (
    <div
      key={index}
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
        src={photo.static}
        alt={photo.alt ?? ""}
        width={photo.width}
        height={photo.height}
        loading="lazy"
        placeholder="blur"
        quality={THUMBNAIL_IMAGE_QUALITY}
        className="object-cover w-full h-full rounded-lg"
        onClick={(event) => {
          onClick?.(event, { ...props, index });
        }}
      />
    </div>
  );
}

const ZOOM_CONFIG: LightboxProps["zoom"] = {
  maxZoomPixelRatio: 5,
  zoomInMultiplier: 2,
  doubleTapDelay: 300,
  doubleClickDelay: 300,
  doubleClickMaxStops: 2,
  keyboardMoveDistance: 50,
  wheelZoomDistanceFactor: 100,
  pinchZoomDistanceFactor: 100,
  scrollToZoom: false,
};

const ANIMATION_CONFIG: Partial<LightboxProps["animation"]> = {
  zoom: 500,
};

function InnerImageGallery(props: ImageGalleryProps) {
  const { images } = props;

  const { enableScroll, disableScroll } = useContext(DisableScrollContext);
  const [index, setIndex] = useState(-1);

  const handleImageClick = useCallback(
    (_: unknown, { index }: { index: number }) => {
      disableScroll();
      setIndex(index);
    },
    [disableScroll],
  );

  const handleReset = useCallback(() => {
    setIndex(-1);
    enableScroll();
  }, [enableScroll]);

  return (
    <>
      <TypedGallery
        photos={images}
        direction="row"
        margin={4}
        renderImage={Photo}
        onClick={handleImageClick}
      />
      <Lightbox
        index={index}
        slides={images}
        render={{
          slide: ({ slide }) => (
            <Image
              key={index}
              // @ts-expect-error
              src={slide.static}
              alt={slide.alt ?? ""}
              fill
              loading="lazy"
              placeholder="blur"
              className="yarl__slide_image"
              unoptimized // need to be unoptimized for preserve the quality when zooming
              draggable={false}
            />
          ),
        }}
        open={index >= 0}
        close={handleReset}
        plugins={[Zoom]}
        zoom={ZOOM_CONFIG}
        animation={ANIMATION_CONFIG}
      />
    </>
  );
}

const ImageGallery = memo(InnerImageGallery);

export { ImageGallery };

export default ImageGallery;
