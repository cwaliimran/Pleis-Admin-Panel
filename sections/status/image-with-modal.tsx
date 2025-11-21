'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Image from 'next/image';
import { FC, useState } from 'react';
import { getValidImage, isValidImage } from '@/utils/image-utils';
import placeHolderImg from '@/assets/profile/placeholder.png';

interface ImageWithModalProps {
  src?: string | null;
  title?: string;
  width?: number;
  height?: number;
  className?: string;
}

const ImageWithModal: FC<ImageWithModalProps> = ({ src, title = 'Image Preview', width = 250, height = 250, className = '' }) => {
  const [open, setOpen] = useState(false);
  const valid = isValidImage(src);

  if (!valid) {
    return (
      <Image
        src={placeHolderImg}
        alt="placeholder"
        width={width}
        height={height}
        className={`rounded-md object-cover opacity-70 ${className}`}
        draggable={false}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Image
          src={getValidImage(src)}
          alt={title}
          width={width}
          height={height}
          className={`cursor-pointer rounded-md object-cover transition hover:opacity-90 ${className}`}
          onClick={() => setOpen(true)}
          draggable={false}
        />
      </DialogTrigger>

      <DialogContent aria-describedby={undefined} className="dark:bg-secondary max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-2 flex justify-center">
          <Image src={getValidImage(src)} alt={title} width={width} height={height} className="w-full rounded-md object-cover" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageWithModal;
