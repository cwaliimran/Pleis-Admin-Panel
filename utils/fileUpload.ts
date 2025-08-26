import axios from 'axios';

export async function uploadFileToAzure(file: File | Blob): Promise<string> {
  const formData = new FormData();
  formData.append('files', file); // API expects 'files' as the key

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}upload/azure`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  // Return the file name from the nested data object
  return response.data?.data?.file;
}
