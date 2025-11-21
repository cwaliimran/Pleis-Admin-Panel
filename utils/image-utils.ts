import placeHolderImg from '@/assets/profile/placeholder.png';
import { noImageUrl, noImageUrlDev, noImageUrlDevCap } from '@/constant/constant';

const invalidImageUrls = [noImageUrl, noImageUrlDev, noImageUrlDevCap];

/**
 * Returns a valid image URL or a placeholder if the given one is invalid.
 */
export const getValidImage = (img?: string | null) => {
  if (!img || invalidImageUrls.includes(img)) {
    return placeHolderImg;
  }
  return img;
};

/**
 * Checks if an image URL is valid (not placeholder or invalid).
 */
export const isValidImage = (img?: string | null) => {
  return !!img && !invalidImageUrls.includes(img);
};
