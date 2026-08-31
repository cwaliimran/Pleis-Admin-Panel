import { CurrentUrl } from '@/constant/constant';
import axios from 'axios';

const getResolvedTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
};

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'jfif', 'png', 'webp', 'gif', 'avif', 'heic', 'heif', 'bmp', 'tif', 'tiff', 'svg'];

export const IMAGE_ACCEPT_ATTRIBUTE = `image/*,${IMAGE_EXTENSIONS.map((extension) => `.${extension}`).join(',')}`;

export const IMAGE_ONLY_ERROR = 'Only image files are allowed (JPG, PNG, WEBP, GIF)';

/**
 * `accept="image/*"` is only a dialog hint — Windows lets the user switch the picker to "All files"
 * and hand back a .zip, so the file has to be checked after selection too. The MIME type is the
 * reliable signal when the OS provides one; otherwise fall back to the extension whitelist.
 */
export function isImageFile(file: File): boolean {
  if (file.type) return file.type.startsWith('image/');
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  return IMAGE_EXTENSIONS.includes(extension);
}

export async function uploadFileToAzure(file: File | Blob): Promise<string> {
  const formData = new FormData();
  formData.append('files', file);

  const response = await axios.post(`${CurrentUrl}/upload/azure`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'X-Timezone': getResolvedTimezone(),
    },
  });

  return response.data?.data?.file;
}
