'use client';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';

interface RHFUploadButtonProps {
  name: string;
  label?: string;
  initialImage?: string | null;
  isLoading?: boolean;
}

const RHFUploadButton: React.FC<RHFUploadButtonProps> = ({
  name,
  label = 'Upload Floor Plan',
  initialImage = null,
  isLoading = false,
}) => {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const [fileName, setFileName] = useState<string>(
    initialImage ? initialImage.split('/').pop() || '' : ''
  );
  const watchedValue = watch(name);

  useEffect(() => {
    if (watchedValue instanceof FileList && watchedValue[0]) {
      setFileName(watchedValue[0].name);
    } else if (typeof watchedValue === 'string') {
      setFileName(watchedValue.split('/').pop() || '');
    } else if (initialImage) {
      setFileName(initialImage.split('/').pop() || '');
    } else {
      setFileName('');
    }
  }, [watchedValue, initialImage]);

  return (
    <div className="flex w-full flex-col gap-3">
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
            setFileName('');
          };

          const handleButtonClick = () => {
            document.getElementById(`button-upload-${name}`)?.click();
          };

          return (
            <>
              <div className="flex w-full flex-col gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleButtonClick}
                  className="border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:text-gray-200"
                  disabled={isLoading}
                >
                  {label}
                </Button>
                <input
                  id={`button-upload-${name}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => onChange(e.target.files)}
                  ref={ref}
                  className="hidden"
                  title={label}
                />
                {fileName && (
                  <div className="relative mt-2 flex items-center gap-2">
                    <span className="text-sm text-gray-700 dark:text-gray-200">
                      {fileName}
                    </span>
                    <button
                      type="button"
                      title="Remove File"
                      onClick={handleRemove}
                      className="rounded-full border border-gray-200 bg-white p-1 shadow dark:border-gray-700 dark:bg-gray-800"
                    >
                      <X className="h-3 w-3 cursor-pointer text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>
                )}
              </div>

              {errors[name] && (
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

export default RHFUploadButton;
