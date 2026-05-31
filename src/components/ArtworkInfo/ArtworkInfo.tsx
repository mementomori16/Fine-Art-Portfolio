"use client";

import { useTranslation } from "react-i18next";
import "./artworkInfo.scss";

export default function ArtworkInfo({ painting }: any) {
  const { t } = useTranslation();

  const baseKey = painting.titleKey.replace(".title", "");

  return (
    <div className="artwork-info">
      <h1>{t(painting.titleKey)}</h1>

      <p>{t(`${baseKey}.medium`)}</p>
      <p>{t(`${baseKey}.size`)}</p>

      <button
        onClick={() =>
          navigator.share?.({
            title: t(painting.titleKey),
            url: window.location.href,
          })
        }
      >
        Share
      </button>
    </div>
  );
}