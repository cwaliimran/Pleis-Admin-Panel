import { useState } from 'react';
import { uploadFileToAzure } from '@/utils/fileUpload';
import { deleteFileFromAzure } from '@/utils/deleteFile';
import { getErrorMessage } from '@/utils/api';
import { showError } from '@/utils/toast';

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File): Promise<string | null> => {
    let uploadedFileKey: string | null = null;
    try {
      setUploading(true);
      uploadedFileKey = await uploadFileToAzure(file);
      return uploadedFileKey;
    } catch (error) {
      showError(getErrorMessage(error));
      if (uploadedFileKey) {
        await deleteFileFromAzure(uploadedFileKey);
      }
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadImage,
    uploading,
  };
}
