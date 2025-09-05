// components/ImageWithFallback.tsx
'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface ImageWithFallbackProps {
  url: string;
  alt: string;
  size?: number;
  className?: string;
}

export default function ImageWithFallback({ 
  url, 
  alt='Image', 
  size = 48, 
  className = '' 
}: ImageWithFallbackProps) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    // Only run if we have a valid URL
    if (url) {
      getValidImageOrPlaceholder(url, alt, size).then(setSrc);
    } else {
      // Generate placeholder immediately if no URL provided
      setSrc(generatePlaceholderImage(alt.charAt(0).toUpperCase(), size));
    }
  }, [url, alt, size]); // Keep dependencies but add proper handling

  // Return null or a placeholder while loading
  if (src === null) {
    return (
      <div 
        style={{ width: size, height: size }} 
        className={`bg-gray-200 animate-pulse rounded ${className}`}
      />
    );
  }

  return <img src={src} alt={alt} width={size} height={size} className={className} />;
}

function generatePlaceholderImage(text: string, size: number = 48): string {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  // Background
  ctx.fillStyle = '#d1d5db';
  ctx.fillRect(0, 0, size, size);

  // Add subtle shadow for text clarity
  ctx.shadowColor = 'rgba(0,0,0,0.15)';
  ctx.shadowBlur = size * 0.08;

  // Text
  ctx.fillStyle = '#22223b';
  ctx.font = `bold ${size * 0.5}px Arial, Roboto, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text?.charAt(0)?.toUpperCase(), size / 2, size / 2);

  return canvas.toDataURL('image/png');
}

async function getValidImageOrPlaceholder(url: string, alt: string, size: number = 48): Promise<string> {
  return new Promise((resolve) => {
    const img = document.createElement('img');
    img.onload = () => resolve(url);
    img.onerror = () => resolve(generatePlaceholderImage(alt.charAt(0).toUpperCase(), size));
    img.src = url;
  });
}