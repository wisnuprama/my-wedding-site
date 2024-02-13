import config from "@/core/config";

import images from "./images";
import { useI18n } from "@/core/i18n";
import { fontCursive } from "@/core/styles";
import dynamic from "next/dynamic";

const ImageGallery = dynamic(() => import("./ImageGallery"), { ssr: false });

export type GallerySectionProps = {};

function GallerySection() {
  const i18n = useI18n();

  if (images.length === 0) {
    return null; // hide gallery if no images
  }

  const filteredImages =
    config.MAX_GALLERY_IMAGES && images.length > config.MAX_GALLERY_IMAGES
      ? images.slice(0, config.MAX_GALLERY_IMAGES)
      : images;

  return (
    <section
      id="gallery"
      className="min-h-screen py-8 md:flex md:flex-col relative"
    >
      <h1
        className={`text-4xl sm:text-5xl md:text-7xl ${fontCursive.className} text-center mb-8`}
      >
        {i18n.t("title_gallery")}
      </h1>
      <div className=" h-full w-full absolute overflow-x-scroll pl-8 md:pl-16 lg:pl-24 xl:pl-64 scroll-smooth no-scrollbar top-40">
        <div className="w-[calc(100vh*6)]">
          <ImageGallery images={filteredImages} />
        </div>
      </div>
    </section>
  );
}

export { GallerySection };
