import Photo100042 from "./photos/Wisnu & Nadia Revised-100042.jpg";
import Photo100131 from "./photos/Wisnu & Nadia Revised-100131.jpg";
import Photo100501 from "./photos/Wisnu & Nadia Revised-100501.jpg";
import Photo100485 from "./photos/Wisnu & Nadia Revised-100485.jpg";
import Photo100458 from "./photos/Wisnu & Nadia Revised-100458.jpg";
import Photo100647 from "./photos/Wisnu & Nadia Revised-100647.jpg";
import Photo100733 from "./photos/Wisnu & Nadia Revised-100733.jpg";
import Photo100970 from "./photos/Wisnu & Nadia Revised-100970.jpg";
import Photo101194 from "./photos/Wisnu & Nadia Revised-101194.jpg";
import Photo101321 from "./photos/Wisnu & Nadia Revised-101321.jpg";
import Photo101621 from "./photos/Wisnu & Nadia Revised-101621.jpg";
import Photo101944 from "./photos/Wisnu & Nadia Revised-101944.jpg";
import Photo101955 from "./photos/Wisnu & Nadia Revised-101955.jpg";
import Photo101976 from "./photos/Wisnu & Nadia Revised-101976.jpg";
import Photo200049 from "./photos/Wisnu & Nadia Revised-200049.jpg";
import Photo200266 from "./photos/Wisnu & Nadia Revised-200266.jpg";
import Photo200467 from "./photos/Wisnu & Nadia Revised-200467.jpg";
import Photo200433 from "./photos/Wisnu & Nadia Revised-200433.jpg";
import Photo200538 from "./photos/Wisnu & Nadia Revised-200538.jpg";
import Photo200897 from "./photos/Wisnu & Nadia Revised-200897.jpg";
import Photo200973 from "./photos/Wisnu & Nadia Revised-200973.jpg";
import Photo201024 from "./photos/Wisnu & Nadia Revised-201024.jpg";
import Photo201124 from "./photos/Wisnu & Nadia Revised-201124.jpg";
import Photo201137 from "./photos/Wisnu & Nadia Revised-201137.jpg";
import Photo201338 from "./photos/Wisnu & Nadia Revised-201338.jpg";
import Photo201697 from "./photos/Wisnu & Nadia Revised-201697.jpg";
import Photo201785 from "./photos/Wisnu & Nadia Revised-201785.jpg";
import Photo201411 from "./photos/Wisnu & Nadia Revised-201411.jpg";
import Photo201462 from "./photos/Wisnu & Nadia Revised-201462.jpg";
import Photo201824 from "./photos/Wisnu Nadia Additional (Color Graded)-201824.jpg";

import { StaticImageData } from "next/image";

interface ImageItem {
  static: StaticImageData;
  src: string;
  alt: string;
  width: number;
  height: number;
  type: "image";
}

interface YoutubeItem {
  src: string;
  alt: string;
  width: number;
  height: number;
  type: "youtube";
}

export function getImages(): Array<YoutubeItem | ImageItem> {
  return [
    {
      src: "https://www.youtube-nocookie.com/embed/tHFy_PGUvLY?si=EWuuZN6--W5dDtms",
      alt: "Wisnu & Nadia - Prewedding Video",
      width: 1920,
      height: 1080,
      type: "youtube",
    },
    {
      static: Photo100042,
      src: "true-Photo100042", // just placeholder to fit the type check of gallery and lightbox
      alt: "",
      type: "image",
      width: 250,
      height: 250,
    },
    {
      static: Photo100131,
      src: "true-Photo100131", // just placeholder to fit the type check of gallery and lightbox
      alt: "",
      type: "image",
      width: 500,
      height: 333,
    },
    {
      static: Photo100501,
      alt: "",
      type: "image",
      src: "true-Photo100501", // just placeholder to fit the type check of gallery and lightbox
      width: 500,
      height: 333,
    },
    {
      static: Photo100485,
      alt: "",
      type: "image",
      src: "true-Photo100485", // just placeholder to fit the type check of gallery and lightbox
      width: 250,
      height: 250,
    },
    {
      static: Photo100458,
      alt: "",
      type: "image",
      src: "true-Photo100458", // just placeholder to fit the type check of gallery and lightbox
      width: 500,
      height: 333,
    },
    {
      static: Photo100647,
      alt: "",
      type: "image",
      src: "truePhoto100647", // just placeholder to fit the type check of gallery and lightbox
      width: 500,
      height: 333,
    },
    {
      static: Photo100733,
      alt: "",
      type: "image",
      src: "truePhoto100733", // just placeholder to fit the type check of gallery and lightbox
      width: 250,
      height: 250,
    },
    {
      static: Photo100970,
      alt: "",
      type: "image",
      src: "truePhoto100970", // just placeholder to fit the type check of gallery and lightbox
      width: 333,
      height: 500,
    },
    {
      static: Photo101194,
      alt: "",
      type: "image",
      src: "truePhoto101194", // just placeholder to fit the type check of gallery and lightbox
      width: 333,
      height: 500,
    },
    {
      static: Photo101321,
      alt: "",
      type: "image",
      src: "truePhoto101321", // just placeholder to fit the type check of gallery and lightbox
      width: 500,
      height: 333,
    },
    {
      static: Photo101621,
      alt: "",
      type: "image",
      src: "truePhoto101621", // just placeholder to fit the type check of gallery and lightbox
      width: 333,
      height: 500,
    },
    {
      static: Photo101944,
      alt: "",
      type: "image",
      src: "truePhoto101944", // just placeholder to fit the type check of gallery and lightbox
      width: 333,
      height: 500,
    },
    {
      static: Photo101955,
      alt: "",
      type: "image",
      src: "truePhoto101955", // just placeholder to fit the type check of gallery and lightbox
      width: 333,
      height: 500,
    },
    {
      static: Photo101976,
      alt: "",
      type: "image",
      src: "truePhoto101976", // just placeholder to fit the type check of gallery and lightbox
      width: 333,
      height: 500,
    },
    {
      static: Photo200049,
      alt: "",
      type: "image",
      src: "truePhoto200049", // just placeholder to fit the type check of gallery and lightbox
      width: 500,
      height: 333,
    },
    {
      static: Photo200266,
      alt: "",
      type: "image",
      src: "truePhoto200266", // just placeholder to fit the type check of gallery and lightbox
      width: 333,
      height: 500,
    },
    {
      static: Photo200467,
      alt: "",
      type: "image",
      src: "truePhoto200467", // just placeholder to fit the type check of gallery and lightbox
      width: 333,
      height: 500,
    },
    {
      static: Photo200433,
      alt: "",
      type: "image",
      src: "truePhoto200433", // just placeholder to fit the type check of gallery and lightbox
      width: 250,
      height: 250,
    },
    {
      static: Photo200538,
      alt: "",
      type: "image",
      src: "truePhoto200538", // just placeholder to fit the type check of gallery and lightbox
      width: 500,
      height: 333,
    },
    {
      static: Photo200897,
      alt: "",
      type: "image",
      src: "truePhoto200897", // just placeholder to fit the type check of gallery and lightbox
      width: 333,
      height: 500,
    },
    {
      static: Photo200973,
      alt: "",
      type: "image",
      src: "truePhoto200973", // just placeholder to fit the type check of gallery and lightbox
      width: 500,
      height: 333,
    },
    {
      static: Photo201024,
      alt: "",
      type: "image",
      src: "truePhoto201024", // just placeholder to fit the type check of gallery and lightbox
      width: 333,
      height: 500,
    },
    {
      static: Photo201124,
      alt: "",
      type: "image",
      src: "truePhoto201124", // just placeholder to fit the type check of gallery and lightbox
      width: 250,
      height: 250,
    },
    {
      static: Photo201137,
      alt: "",
      type: "image",
      src: "truePhoto201137", // just placeholder to fit the type check of gallery and lightbox
      width: 333,
      height: 500,
    },
    {
      static: Photo201338,
      alt: "",
      type: "image",
      src: "truePhoto201338", // just placeholder to fit the type check of gallery and lightbox
      width: 333,
      height: 500,
    },
    {
      static: Photo201697,
      alt: "",
      type: "image",
      src: "truePhoto201697", // just placeholder to fit the type check of gallery and lightbox
      width: 333,
      height: 500,
    },
    {
      static: Photo201785,
      alt: "",
      type: "image",
      src: "truePhoto201785", // just placeholder to fit the type check of gallery and lightbox
      width: 333,
      height: 500,
    },
    {
      static: Photo201411,
      alt: "",
      type: "image",
      src: "truePhoto201411", // just placeholder to fit the type check of gallery and lightbox
      width: 500,
      height: 333,
    },
    {
      static: Photo201462,
      alt: "",
      type: "image",
      src: "truePhoto201462", // just placeholder to fit the type check of gallery and lightbox
      width: 500,
      height: 333,
    },
    {
      static: Photo201824,
      alt: "",
      type: "image",
      src: "truePhoto201824", // just placeholder to fit the type check of gallery and lightbox
      width: 333,
      height: 500,
    },
  ];
}
