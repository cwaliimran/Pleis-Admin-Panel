import { IMAGE_ACCEPT_ATTRIBUTE, IMAGE_ONLY_ERROR, isImageFile } from '@/utils/fileUpload';
import { showError } from '@/utils/toast';
import { useEffect, useState } from 'react';
import { useFormContext, Controller, useWatch } from 'react-hook-form';
import { Camera, X } from 'lucide-react';

interface RHFUploadAvatarProps {
  name: string;
  label?: string;
  size?: number;
  initialImage?: string | null;
}

const RHFUploadAvatar: React.FC<RHFUploadAvatarProps> = ({
  name,
  label = 'Upload Avatar',
  size = 120,
  initialImage = null,
}) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [preview, setPreview] = useState<string | null>(initialImage);
  const [imageError, setImageError] = useState(false);
  const watchedValue = useWatch({ control, name, defaultValue: initialImage });

  useEffect(() => {
    // Handle preview based on watched value or initial image
    if (watchedValue) {
      if (watchedValue instanceof FileList && watchedValue[0] instanceof File) {
        const objectUrl = URL.createObjectURL(watchedValue[0]);
        setPreview(objectUrl);
        setImageError(false);
        return () => URL.revokeObjectURL(objectUrl);
      } else if (typeof watchedValue === 'string') {
        setPreview(watchedValue);
        setImageError(false);
      }
    } else if (initialImage && typeof initialImage === 'string') {
      setPreview(initialImage);
      setImageError(false);
    } else {
      setPreview(null);
      setImageError(false);
    }
  }, [watchedValue, initialImage]);

  const handleRemove = () => {
    setValue(name, null);
    setPreview(null);
    setImageError(false);
  };

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
        render={({ field: { onChange, ref } }) => (
          <>
            {/* Avatar Upload Box */}
            <div className="relative rounded-full border border-dashed p-2">
              <div
                className={`relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-full border bg-gray-200 transition hover:opacity-80 dark:bg-gray-700 ${
                  errors[name]
                    ? 'border-dashed border-red-400'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                style={{ width: size, height: size }}
              >
                <label
                  htmlFor={`avatar-upload-${name}`}
                  className="flex h-full w-full cursor-pointer items-center justify-center"
                >
                  {preview && !imageError ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={preview}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <Camera className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                  )}
                </label>

                {/* File Input */}
                <input
                  id={`avatar-upload-${name}`}
                  type="file"
                  accept={IMAGE_ACCEPT_ATTRIBUTE}
                  onChange={(e) => {
                    const files = e.target.files;
                    if (!files || files.length === 0) return;

                    if (!isImageFile(files[0])) {
                      showError(IMAGE_ONLY_ERROR);
                      // Clearing the input lets the same rejected file fire onChange again on a retry.
                      e.target.value = '';
                      return;
                    }

                    onChange(files);
                  }}
                  ref={ref}
                  className="hidden"
                />

                {/* Remove Button */}
                {preview && !imageError && (
                  <button
                    type="button"
                    title="Remove Avatar"
                    onClick={handleRemove}
                    className="absolute top-[-6px] right-[-6px] rounded-full border border-gray-200 bg-white p-1 shadow dark:border-gray-700 dark:bg-gray-800"
                  >
                    <X className="h-3 w-3 text-gray-600 dark:text-gray-300" />
                  </button>
                )}
              </div>
            </div>

            {/* Validation Error */}
            {errors[name] && (
              <p className="text-sm text-red-400">
                {(errors[name] as any).message}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
};

export default RHFUploadAvatar;

// 'use client';
// import { Camera, X } from 'lucide-react';
// import Image from 'next/image';
// import React, { useEffect, useState } from 'react';
// import { Controller, useFormContext } from 'react-hook-form';

// interface RHFUploadAvatarProps {
//   name: string;
//   label?: string;
//   size?: number;
//   initialImage?: string | null;
// }

// const RHFUploadAvatar: React.FC<RHFUploadAvatarProps> = ({
//   name,
//   label = 'Upload Avatar',
//   size = 120,
//   initialImage = null,
// }) => {
//   const {
//     control,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useFormContext();

//   const [preview, setPreview] = useState<string | null>(initialImage);
//   const watchedValue = watch(name);

//   useEffect(() => {
//     if (watchedValue?.[0]) {
//       const objectUrl = URL.createObjectURL(watchedValue[0]);
//       setPreview(objectUrl);
//       return () => URL.revokeObjectURL(objectUrl);
//     } else if (initialImage) {
//       setPreview(initialImage);
//     } else {
//       setPreview(null);
//     }
//     // Only update preview if watchedValue or initialImage changes
//   }, [watchedValue, initialImage]);

//   return (
//     <div className="flex flex-col items-center gap-3">
//       {/* Label */}
//       {label && (
//         <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
//           {label}
//         </label>
//       )}

//       <Controller
//         name={name}
//         control={control}
//         render={({ field: { onChange, ref } }) => {
//           const handleRemove = () => {
//             setValue(name, null);
//             setPreview(null);
//           };
//           //   const hasError = (errors[name] as any)?.message;

//           return (
//             <>
//               {/* Avatar Upload Box */}
//               <div className="relative rounded-full border border-dashed p-2">
//                 <div
//                   className={`relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-full border bg-gray-200 transition hover:opacity-80 dark:bg-gray-700 ${
//                     errors[name]
//                       ? 'border-dashed border-red-400'
//                       : 'border-gray-300 dark:border-gray-600'
//                   } `}
//                   // ${`w-[${size}] h-[${size}]`}
//                   style={{ width: size, height: size }}
//                 >
//                   <label
//                     htmlFor={`avatar-upload-${name}`}
//                     className="flex h-full w-full cursor-pointer items-center justify-center"
//                   >
//                     {preview ? (
//                       <Image
//                         src={preview}
//                         alt="Avatar"
//                         className="h-full w-full object-cover"
//                         width={size}
//                         height={size}
//                       />
//                     ) : (
//                       <Camera className="h-6 w-6 text-gray-500 dark:text-gray-400" />
//                     )}
//                   </label>

//                   {/* File Input */}
//                   <input
//                     id={`avatar-upload-${name}`}
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => onChange(e.target.files)}
//                     ref={ref}
//                     className="hidden"
//                   />

//                   {/* Remove Button */}
//                   {preview && (
//                     <button
//                       type="button"
//                       title="Remove Avatar"
//                       onClick={handleRemove}
//                       className="absolute top-[-6px] right-[-6px] rounded-full border border-gray-200 bg-white p-1 shadow dark:border-gray-700 dark:bg-gray-800"
//                     >
//                       <X className="h-3 w-3 text-gray-600 dark:text-gray-300" />
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {/* Validation Error */}
//               {errors[name] && (
//                 <p className="text-sm text-red-400">
//                   {(errors[name] as any).message}
//                 </p>
//               )}
//             </>
//           );
//         }}
//       />
//     </div>
//   );
// };

// export default RHFUploadAvatar;
