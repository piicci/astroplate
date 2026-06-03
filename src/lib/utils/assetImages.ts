import type { ImageMetadata } from "astro";
import { getImage } from "astro:assets";

type ImageModule = () => Promise<{ default: ImageMetadata }>;
type ImageTransformOptions = {
  width?: number;
  height?: number;
  format?: "avif" | "jpeg" | "jpg" | "png" | "webp";
  quality?: number;
  fit?: "cover" | "contain" | "fill" | "inside" | "outside";
};

const assetImages = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/images/**/*.{avif,gif,jpeg,jpg,png,svg,webp}",
);

const legacyPublicImages = import.meta.glob<{ default: ImageMetadata }>(
  "/public/images/**/*.{avif,gif,jpeg,jpg,png,svg,webp}",
);

const isExternalImage = (src: string) =>
  /^(?:https?:)?\/\//.test(src) || src.startsWith("data:");

const imageCandidates = (src: string) => {
  if (src.startsWith("/images/")) {
    return [`/src/assets${src}`, `/public${src}`];
  }

  if (src.startsWith("src/assets/")) {
    return [`/${src}`];
  }

  if (src.startsWith("/src/assets/")) {
    return [src];
  }

  return [src];
};

export const resolveImageAsset = async (
  src?: string | null,
): Promise<ImageMetadata | null> => {
  if (!src || isExternalImage(src)) {
    return null;
  }

  for (const candidate of imageCandidates(src)) {
    const module =
      (assetImages[candidate] as ImageModule | undefined) ??
      (legacyPublicImages[candidate] as ImageModule | undefined);

    if (module) {
      return (await module()).default;
    }
  }

  return null;
};

export const resolveOptimizedImageSrc = async (
  src?: string | null,
  options: ImageTransformOptions = {},
): Promise<string | undefined> => {
  if (!src) {
    return undefined;
  }

  const asset = await resolveImageAsset(src);

  if (!asset) {
    return src;
  }

  const optimized = await getImage({
    src: asset,
    ...options,
  } as any);

  return optimized.src;
};
