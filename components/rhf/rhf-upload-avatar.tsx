
"use client";
import React, { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Camera, X } from "lucide-react";

interface RHFUploadAvatarProps {
    name: string;
    label?: string;
    size?: number;
}

const RHFUploadAvatar: React.FC<RHFUploadAvatarProps> = ({
    name,
    label = "Upload Avatar",
    size = 120,
}) => {
    const {
        control,
        setValue,
        formState: { errors },
    } = useFormContext();

    const [preview, setPreview] = useState<string | null>(null);

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
                render={({ field: { value, onChange, ref } }) => {
                    useEffect(() => {
                        if (value?.[0]) {
                            const objectUrl = URL.createObjectURL(value[0]);
                            setPreview(objectUrl);
                            return () => URL.revokeObjectURL(objectUrl);
                        } else {
                            setPreview(null);
                        }
                    }, [value]);

                    const handleRemove = () => {
                        setValue(name, null);
                        setPreview(null);
                    };
                    const hasError = (errors[name] as any)?.message;

                    return (
                        <>
                            {/* Avatar Upload Box */}
                            <div className="relative border border-dashed rounded-full p-2">
                                <div
                                    className={`relative w-full h-full rounded-full overflow-hidden flex items-center justify-center
    border ${errors[name] ? "border-dashed border-red-400" : "border-gray-300 dark:border-gray-600"}
    bg-gray-200 dark:bg-gray-700 transition hover:opacity-80 cursor-pointer`}
                                    style={{ width: size, height: size }}
                                >

                                    <label
                                        htmlFor={`avatar-upload-${name}`}
                                        className="w-full h-full flex items-center justify-center cursor-pointer"
                                    >
                                        {preview ? (
                                            <img
                                                src={preview}
                                                alt="Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Camera className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                        )}
                                    </label>

                                    {/* File Input */}
                                    <input
                                        id={`avatar-upload-${name}`}
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => onChange(e.target.files)}
                                        ref={ref}
                                        className="hidden"
                                    />

                                    {/* Remove Button */}
                                    {preview && (
                                        <button
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
                            {errors[name] && (
                                <p className="text-sm text-red-400 ">
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

export default RHFUploadAvatar;
