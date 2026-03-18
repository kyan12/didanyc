"use client";

import { useState, useTransition, useCallback, useMemo } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import type { ProductDetail as ProductDetailType, ProductVariant } from "@/lib/shopify/types";
import { addToCart } from "./actions";
import styles from "./product-detail.module.css";

interface Props {
  product: ProductDetailType;
}

function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(parseFloat(amount));
}

function findVariant(
  variants: ProductVariant[],
  selectedOptions: Record<string, string>
): ProductVariant | undefined {
  return variants.find((v) =>
    v.selectedOptions.every(
      (opt) => selectedOptions[opt.name] === opt.value
    )
  );
}

function getDiscountPercent(price: string, compareAt: string): number {
  const p = parseFloat(price);
  const c = parseFloat(compareAt);
  if (c <= p) return 0;
  return Math.round(((c - p) / c) * 100);
}

export function ProductDetail({ product }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [cartMessage, setCartMessage] = useState<string | null>(null);

  const variants = useMemo(
    () => product.variants.edges.map((e) => e.node),
    [product.variants.edges]
  );
  const images = useMemo(
    () => product.images.edges.map((e) => e.node),
    [product.images.edges]
  );

  // Build selected options from URL params, defaulting to first variant
  const selectedOptions = useMemo(() => {
    const opts: Record<string, string> = {};
    for (const option of product.options) {
      const paramValue = searchParams.get(option.name);
      if (paramValue && option.values.includes(paramValue)) {
        opts[option.name] = paramValue;
      } else {
        opts[option.name] = option.values[0];
      }
    }
    return opts;
  }, [product.options, searchParams]);

  const selectedVariant = useMemo(
    () => findVariant(variants, selectedOptions),
    [variants, selectedOptions]
  );

  // Image gallery state — prefer variant image if available
  const variantImageIndex = selectedVariant?.image
    ? images.findIndex((img) => img.url === selectedVariant.image!.url)
    : -1;
  const [activeImageIndex, setActiveImageIndex] = useState(
    variantImageIndex >= 0 ? variantImageIndex : 0
  );
  const activeImage = images[activeImageIndex] ?? images[0];

  // Update URL params when selecting options
  const setOption = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // Check if a specific option value is available given current selections
  const isOptionAvailable = useCallback(
    (optionName: string, optionValue: string): boolean => {
      const testOptions = { ...selectedOptions, [optionName]: optionValue };
      const variant = findVariant(variants, testOptions);
      return variant ? variant.availableForSale : false;
    },
    [selectedOptions, variants]
  );

  const handleAddToCart = () => {
    if (!selectedVariant || !selectedVariant.availableForSale) return;
    setCartMessage(null);
    startTransition(async () => {
      const result = await addToCart(selectedVariant.id);
      if (result.error) {
        setCartMessage(result.error);
      } else {
        setCartMessage("Added to cart");
        setTimeout(() => setCartMessage(null), 3000);
      }
    });
  };

  // Price display
  const price = selectedVariant?.price ?? product.priceRange.minVariantPrice;
  const compareAt = selectedVariant?.compareAtPrice;
  const hasDiscount = compareAt && parseFloat(compareAt.amount) > parseFloat(price.amount);
  const discountPercent = hasDiscount
    ? getDiscountPercent(price.amount, compareAt.amount)
    : 0;

  const hasMultipleOptions = product.options.length > 1 || product.options[0]?.values.length > 1;

  return (
    <div className={styles.layout}>
      {/* Image Gallery */}
      <div className={styles.gallery}>
        <div className={styles.mainImage}>
          {activeImage ? (
            <Image
              src={activeImage.url}
              alt={activeImage.altText ?? product.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.image}
              priority
            />
          ) : (
            <div className={styles.placeholder} />
          )}
        </div>
        {images.length > 1 && (
          <div className={styles.thumbnails}>
            {images.map((img, i) => (
              <button
                key={img.url}
                className={`${styles.thumbnail} ${i === activeImageIndex ? styles.thumbnailActive : ""}`}
                onClick={() => setActiveImageIndex(i)}
                aria-label={`View image ${i + 1}`}
              >
                <Image
                  src={img.url}
                  alt={img.altText ?? `${product.title} ${i + 1}`}
                  fill
                  sizes="80px"
                  className={styles.thumbImage}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className={styles.info}>
        {product.vendor && (
          <p className={styles.vendor}>{product.vendor}</p>
        )}
        <h1 className={styles.title}>{product.title}</h1>

        {/* Price */}
        <div className={styles.pricing}>
          <span className={hasDiscount ? styles.salePrice : styles.price}>
            {formatPrice(price.amount, price.currencyCode)}
          </span>
          {hasDiscount && (
            <>
              <span className={styles.compareAt}>
                {formatPrice(compareAt.amount, compareAt.currencyCode)}
              </span>
              <span className={styles.badge}>-{discountPercent}%</span>
            </>
          )}
        </div>

        {/* Variant Selectors */}
        {hasMultipleOptions &&
          product.options.map((option) => (
            <div key={option.name} className={styles.optionGroup}>
              <label className={styles.optionLabel}>
                {option.name}
                <span className={styles.optionValue}>
                  {selectedOptions[option.name]}
                </span>
              </label>
              <div className={styles.optionValues}>
                {option.values.map((value) => {
                  const isSelected = selectedOptions[option.name] === value;
                  const available = isOptionAvailable(option.name, value);
                  return (
                    <button
                      key={value}
                      className={`${styles.optionButton} ${isSelected ? styles.optionSelected : ""} ${!available ? styles.optionUnavailable : ""}`}
                      onClick={() => setOption(option.name, value)}
                      disabled={!available && !isSelected}
                      aria-pressed={isSelected}
                    >
                      {value}
                      {!available && <span className={styles.strikethrough} />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

        {/* Add to Cart */}
        <button
          className={styles.addToCart}
          onClick={handleAddToCart}
          disabled={
            isPending ||
            !selectedVariant ||
            !selectedVariant.availableForSale
          }
        >
          {isPending
            ? "Adding..."
            : !selectedVariant || !selectedVariant.availableForSale
              ? "Sold Out"
              : "Add to Cart"}
        </button>

        {cartMessage && (
          <p
            className={
              cartMessage === "Added to cart"
                ? styles.successMessage
                : styles.errorMessage
            }
          >
            {cartMessage}
          </p>
        )}

        {/* Description */}
        {product.descriptionHtml && (
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
        )}
      </div>
    </div>
  );
}
