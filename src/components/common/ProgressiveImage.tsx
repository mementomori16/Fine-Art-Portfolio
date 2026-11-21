"use client";

import React, { useState, useEffect } from "react";

interface ProgressiveImageProps {
  src: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  loading?: "eager" | "lazy";
  onClick?: () => void;
}

export default function ProgressiveImage({
  src,
  alt = "",
  className = "",
  style,
  loading = "lazy",
  onClick,
}: ProgressiveImageProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [src]);

  if (!src) return null;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      onClick={onClick}
      onLoad={() => {
        if (!loaded) setLoaded(true);
      }}
      onError={() => {
        if (!loaded) setLoaded(true);
      }}
      style={{
        ...style,
        opacity: loaded ? (style?.opacity ?? 1) : 0.85,
        transition: "opacity 0.25s ease",
      }}
    />
  );
}