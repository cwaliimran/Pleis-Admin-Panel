import { CurrentUrl } from '@/constant/constant';
import axios from 'axios';

const getResolvedTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
};

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
