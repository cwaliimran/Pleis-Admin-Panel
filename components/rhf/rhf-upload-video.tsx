"use client";
import { Camera, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface RHFUploadVideoProps {
  name: string;
  label?: string;
  width?: number;
  height?: number;
}

const RHFUploadVideo: React.FC<RHFUploadVideoProps> = ({
  name,
  label = "Upload Video",
  width = 200,
  height = 120,
}) => {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const [preview, setPreview] = useState<string | null>(null);
  const watchedValue = watch(name);

  useEffect(() => {
    if (watchedValue?.[0]) {
      const objectUrl = URL.createObjectURL(watchedValue[0]);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [watchedValue]);

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Label */}
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, ref } }) => {
          const handleRemove = () => {
            setValue(name, null);
            setPreview(null);
          };

          const hasError = (errors[name] as any)?.message;

          return (
            <>
              {/* Upload Box */}
              <div className="relative border border-dashed rounded-md p-2">
                <div
                  className={`relative w-full h-full overflow-hidden flex items-center justify-center border bg-gray-200 dark:bg-gray-700 transition hover:opacity-80 cursor-pointer w-[${width}] h-[${height}] ${
                    hasError
                      ? "border-dashed border-red-400"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  // style={{ width, height }}
                >
                  <label
                    htmlFor={`video-upload-${name}`}
                    className="w-full h-full flex items-center justify-center cursor-pointer"
                  >
                    {preview ? (
                      <video
                        src={preview}
                        controls
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    )}
                  </label>

                  {/* File Input */}
                  <input
                    id={`video-upload-${name}`}
                    type="file"
                    accept="video/*"
                    onChange={(e) => onChange(e.target.files)}
                    ref={ref}
                    className="hidden"
                  />

                  {/* Remove Button */}
                  {preview && (
                    <button
                      title="Remove Video"
                      type="button"
                      onClick={handleRemove}
                      className="absolute top-[-6px] right-[-6px] bg-white dark:bg-gray-800 
                        rounded-full p-1 border border-gray-200 dark:border-gray-700 shadow"
                    >
                      <X className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                    </button>
                  )}
                </div>
              </div>

              {/* Validation Error */}
              {hasError && (
                <p className="text-sm text-red-400">
                  {(errors[name] as any).message}
                </p>
              )}
            </>
          );
        }}
      />
    </div>
  );
};

export default RHFUploadVideo;
