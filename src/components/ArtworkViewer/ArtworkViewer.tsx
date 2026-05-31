"use client";

import { useState } from "react";
import ViewGallery from "../ViewGallery/ViewGallery";
import "./artworkViewer.scss";

interface ImageData {
  url: string;
  title: string;
  date: string;
}

interface Props {
  images: ImageData[];
}

export default function ArtworkViewer({ images }: Props) {
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);

  return (
    <div className="viewer">

      <div className="main-image" onClick={() => setOpen(true)}>
        <img src={images[current].url} alt="artwork" />
      </div>

      <div className="thumbnails">
        {images.map((img, i) => (
          <img
            key={i}
            src={img.url}
            className={i === current ? "active" : ""}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>

      {open && (
        <ViewGallery
          images={images}
          currentImageId={current}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}