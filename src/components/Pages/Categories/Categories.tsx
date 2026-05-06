"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { CATEGORY_COVERS } from '../../../../app/data/paintings';
import './categories.scss';

const Categories: React.FC = () => {
    const { t } = useTranslation();

    return (
        <section className="categories-section">
            <div className="container">
                <header className="categories-header">
                    <h2 className="categories-title">{t('categories.pageTitle')}</h2>
                    <div className="categories-line"></div>
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
                                    /* 
                                       Next.js tells Cloudinary to serve ~100kb version 
                                       for thumbnails based on these sizes 
                                    */
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    className="category-img"
                                    priority={true} 
                                />
                                <div className="category-overlay">
                                    <span>{t('common.viewGallery')}</span>
                                </div>
                            </div>

                            <div className="category-info">
                                <h3>{t(category.titleKey)}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Categories;