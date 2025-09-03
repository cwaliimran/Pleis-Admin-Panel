import { CurrentUrl } from '@/constant/constant';
import axios from 'axios';

export async function deleteFileFromAzure(fileUrl: string): Promise<boolean> {
  try {
    const response = await axios.delete(`${CurrentUrl}/upload/azure`, {
      data: { fileKey: fileUrl }, 
    });

    return response.data?.success ?? true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}
