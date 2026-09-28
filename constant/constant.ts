// Prefer NEXT_PUBLIC_API_URL; keep LOCAL_URL fallback for existing Vercel envs
export const CurrentUrl =
  process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_LOCAL_URL;
export const noImageUrl = 'https://pleisstorage.blob.core.windows.net/pleisappcontainer/noimage.png';
export const noImageUrlDev = 'https://pleisstorage.blob.core.windows.net/pleisappcontainerdev/noimage.png';
export const noImageUrlDevCap = 'https://pleisstorage.blob.core.windows.net/pleisappcontainerdev/noImage.png';

// ============================================================
// Realtime (Socket.IO)
//
// The socket server is the same host as the REST API, just without the
// `/api/v1` prefix — so the origin is derived from `CurrentUrl` rather than
// configured twice. Set `NEXT_PUBLIC_SOCKET_URL` to point somewhere else.
// ============================================================

const deriveSocketUrl = (apiUrl?: string): string => {
  if (!apiUrl) return '';

  try {
    return new URL(apiUrl).origin;
  } catch {
    return '';
  }
};

export const SocketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || deriveSocketUrl(CurrentUrl);
