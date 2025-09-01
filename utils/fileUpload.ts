import axios from 'axios';

export async function uploadFileToAzure(file: File | Blob): Promise<string> {
  const formData = new FormData();
  formData.append('files', file);

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_LIVE_URL}/upload/azure`,
    // `${process.env.NEXT_PUBLIC_LOCAL_URL}/upload/azure`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data?.data?.file;
}
