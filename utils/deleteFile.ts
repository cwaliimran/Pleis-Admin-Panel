import axios from 'axios';

export async function deleteFileFromAzure(fileUrl: string): Promise<boolean> {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_LIVE_URL}/upload/azure`,
      {
        data: { fileKey: fileUrl }, // send file reference in body
      }
    );

    return response.data?.success ?? true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}
