import { CurrentUrl } from '@/constant/constant';
import axios from 'axios';

const getResolvedTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
};

export async function deleteFileFromAzure(fileUrl: string): Promise<boolean> {
  try {
    const response = await axios.delete(`${CurrentUrl}/upload/azure`, {
      data: { fileKey: fileUrl },
      headers: {
        'X-Timezone': getResolvedTimezone(),
      },
    });

    return response.data?.success ?? true;
  } catch (error) {
    console.log('Error deleting file:', error);
    return false;
  }
}
