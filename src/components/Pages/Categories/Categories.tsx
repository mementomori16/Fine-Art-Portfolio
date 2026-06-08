"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { CATEGORY_COVERS } from "../../../../app/data/paintings";
import "./categories.scss";

const Categories: React.FC = () => {
    const { t } = useTranslation();

    return (
        <section className="categories-section">

            <header className="categories-header">
                <h2 className="categories-title">
                    {t("categories.pageTitle")}
                </h2>

                <p className="categories-subtitle">
                    {t("categories.subtitle")}
                </p>
            </header>

            <div className="categories-grid">
                {CATEGORY_COVERS.map((category) => (
                    <Link
                        href={`/categories/${category.slug}`}
                        key={category.id}
                        className="category-card"
                    >
                        <div className="category-image-wrapper">
                            <Image
                                src={category.cloudinaryId}
                                alt={t(category.titleKey)}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="category-img"
                                priority
                            />

                            <div className="category-content">
                                <h3>{t(category.titleKey)}</h3>
                                <span>{t("common.viewGallery")}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

        </section>
    );
};

export default Categories;