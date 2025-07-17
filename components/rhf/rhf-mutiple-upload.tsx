'use client';

import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import { CloudUpload, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  name: string;
  label?: string;
}

export default function RHFMultiFileUpload({ name, label }: Props) {
  const { setValue } = useFormContext();
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const updatedFiles = [...files, ...acceptedFiles];
      setFiles(updatedFiles);
      setValue(name, updatedFiles, { shouldValidate: true });

      const previewUrls = updatedFiles.map((file) => URL.createObjectURL(file));
      setPreviews(previewUrls);
    },
    [files, name, setValue]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop,
  });

  const handleRemove = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    setValue(name, updatedFiles, { shouldValidate: true });

    const updatedPreviews = [...previews];
    updatedPreviews.splice(index, 1);
    setPreviews(updatedPreviews);
  };

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  return (
    <div className="space-y-2">
      {label && <label className="font-medium text-sm text-gray-700">{label}</label>}

      {/* Upload Drop Zone */}
      <div
        {...getRootProps()}
        className={cn(
          'group flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer bg-gray-100 dark:bg-gray-700  hover:shadow-md transition duration-300',
          // isDragActive ? 'bg-gray-200' : 'bg-white'
        )}
      >
        <input {...getInputProps()} />
        <p className="text-sm text-gray-500 group-hover:text-gray-600 transition"><CloudUpload  className='md:w-15 md:h-15 w-10 h-10 '/></p>
      </div>

      {/* Preview Images */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3 mt-4">
          {previews.map((src, index) => (
            <div
              key={index}
              className="relative group md:h-20 md:w-20 h-15 w-15 rounded-lg overflow-hidden border shadow-sm hover:shadow-lg transition "
            >
              <Image
                src={src}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover p-1"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 bg-white/80 hover:bg-white text-gray-600 hover:text-red-600 rounded-full p-1 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
