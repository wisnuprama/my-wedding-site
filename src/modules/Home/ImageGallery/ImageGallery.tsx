"use client";
import Gallery, {
  GalleryI,
  GalleryProps,
  RenderImageProps,
} from "react-photo-gallery";
import Image, { StaticImageData } from "next/image";
import Lightbox, {
  LightboxExternalProps,
  LightboxProps,
} from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { memo, useCallback, useContext, useMemo, useState } from "react";
import { DisableScrollContext } from "@/components/DisableScroll/context";
import { useDragScrollX } from "@/common/hooks";

type ImageItem = {
  src: string;
  static: StaticImageData;
  alt: string;
  width: number;
  height: number;
  type: "image";
};

type YoutubeItem = {
  src: string;
  alt: string;
  width: number;
  height: number;
  type: "youtube";
};

const TypedGallery = Gallery as unknown as GalleryI<ImageItem | YoutubeItem>;

export type ImageGalleryProps = {
  images: Array<YoutubeItem | ImageItem>;
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
        className="object-cover w-full h-full rounded-lg cursor-pointer"
        onClick={(event) => {
          onClick?.(event, { ...props, index });
        }}
      />
    </div>
  );
}

function YoutubeVideo(props: RenderImageProps<YoutubeItem>) {
  const { index, photo, margin, top, left, direction } = props;

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
      <iframe
        title="YouTube video player"
        frameBorder="0"
        src={photo.src}
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;"
        referrerPolicy="strict-origin-when-cross-origin"
        width={photo.width}
        height={photo.height}
        className="object-cover w-full h-full rounded-lg cursor-pointer"
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

const LIGHTBOX_PLUGINS = [Zoom];

function InnerImageGallery(props: ImageGalleryProps) {
  const { enableScroll, disableScroll } = useContext(DisableScrollContext);

  const { images: imagesProp } = props;

  const images = useMemo(() => {
    // For mobile UX, we will use a fixed size 1:1 for the video
    // so the Youtube control is visible to users.
    // If no, then users need to scroll horizontally to find the control,
    // especially to trigger full screen.
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    return imagesProp.map((image) => {
      if (image.type !== "youtube") {
        return image;
      }

      return {
        ...image,
        width: isMobile ? 300 : 640,
        height: isMobile ? 300 : 360,
      };
    });
  }, [imagesProp]);

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

  const lightBoxRender: LightboxExternalProps["render"] = useMemo(
    () => ({
      slide: ({ slide }) => {
        switch (slide.type) {
          case "image":
            return (
              <Image
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
            );

          default:
            return <div />;
        }
      },
    }),
    [],
  );

  const containerRef = useDragScrollX();

  const renderGalleryImage = useCallback(
    (props: RenderImageProps<ImageItem | YoutubeItem>) => {
      switch (props.photo.type) {
        case "image":
          return (
            <Photo {...(props as unknown as RenderImageProps<ImageItem>)} />
          );
        case "youtube":
          return (
            <YoutubeVideo
              {...(props as unknown as RenderImageProps<YoutubeItem>)}
            />
          );
      }
    },
    [],
  );

  return (
    <div
      ref={containerRef}
      className=" h-full w-full absolute overflow-x-scroll pl-8 md:pl-16 lg:pl-24 xl:pl-64 scroll-smooth no-scrollbar top-40"
    >
      <div className="w-[calc(100vh*6)]">
        <TypedGallery
          photos={images}
          direction="row"
          margin={4}
          renderImage={renderGalleryImage}
          onClick={handleImageClick}
        />
        <Lightbox
          index={index}
          slides={
            images as ImageItem[] /* we cast it to ImageItem because we won't open youtube vid on a lightbox */
          }
          render={lightBoxRender}
          open={index >= 0}
          close={handleReset}
          plugins={LIGHTBOX_PLUGINS}
          zoom={ZOOM_CONFIG}
          animation={ANIMATION_CONFIG}
        />
      </div>
    </div>
  );
}

const ImageGallery = memo(InnerImageGallery);

export { ImageGallery };

export default ImageGallery;
