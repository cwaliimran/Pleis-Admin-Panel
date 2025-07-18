"use client";

import { useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";
import { CloudUpload, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

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

      // Create preview URLs only for new files
      const newPreviewUrls = acceptedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      const allPreviewUrls = [...previews, ...newPreviewUrls];
      setPreviews(allPreviewUrls);
    },
    [files, previews, name, setValue]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
  });

  const handleRemove = (index: number) => {
    // Clean up the preview URL for the removed image
    if (previews[index]) {
      URL.revokeObjectURL(previews[index]);
    }

    // Remove from both arrays at the same index
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);

    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
    setValue(name, updatedFiles, { shouldValidate: true });
  };

  useEffect(() => {
    // Cleanup function to revoke all object URLs when component unmounts
    return () => {
      previews.forEach((url) => {
        if (url && typeof url === "string") {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []); // Only run on unmount

  return (
    <div className="space-y-2">
      {label && (
        <label className="font-medium text-sm text-gray-700">{label}</label>
      )}

      {/* Upload Drop Zone */}
      <div
        {...getRootProps()}
        className={cn(
          "group flex flex-col mt-1 items-center justify-center border border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer bg-gray-100 dark:bg-gray-700  hover:shadow-md transition duration-300"
          // isDragActive ? 'bg-gray-200' : 'bg-white'
        )}
      >
        <input {...getInputProps()} />
        <CloudUpload className="w-12 h-12 text-gray-400 mb-2" />
        <p className="text-sm text-gray-500 group-hover:text-gray-600 transition">
          Drag & drop images here, or click to select
        </p>
      </div>

      {/* Preview Images */}
      {previews.length > 0 &&
        files.length > 0 &&
        previews.length === files.length && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-4">
            {previews.map((src, index) => (
              <div
                key={`${files[index]?.name}-${index}`}
                className="relative group h-20 w-20 rounded-lg overflow-hidden border shadow-sm hover:shadow-lg transition"
              >
                <Image
                  src={src}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute top-1 right-1 bg-white/80 hover:bg-white text-gray-600 hover:text-red-600 rounded-full p-1 transition cursor-pointer"
                  aria-label={`Remove image ${index + 1}`}
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
