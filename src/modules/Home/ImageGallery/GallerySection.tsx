import config from "@/core/config";
import { ImageGallery } from "./ImageGallery";

import images from "./images";
import { useI18n } from "@/core/i18n";
import { fontCursive } from "@/core/styles";

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
      className="min-h-screen px-8 py-8 md:px-16 lg:px-24 xl:px-64 md:flex md:flex-col"
    >
      <h1
        className={`text-4xl sm:text-5xl md:text-7xl ${fontCursive.className} text-center mb-8`}
      >
        {i18n.t("title_gallery")}
      </h1>
      <ImageGallery images={filteredImages} />
    </section>
  );
}

export { GallerySection };
