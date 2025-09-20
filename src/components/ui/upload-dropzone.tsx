"use client";

import { useDropzone } from "react-dropzone";
import { useUploadThing } from "@/utils/uploadthing";
import { cn } from "@/lib/utils";

interface UploadDropzoneProps {
  endpoint: "profileImage";
  onClientUploadComplete?: (res: unknown) => void;
  onUploadError?: (error: Error) => void;
  className?: string;
}

export function CustomUploadDropzone({
  endpoint,
  onClientUploadComplete,
  onUploadError,
  className,
}: UploadDropzoneProps) {
  const { startUpload } = useUploadThing(endpoint, {
    onClientUploadComplete,
    onUploadError,
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      startUpload(acceptedFiles);
    },
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
    maxSize: 4 * 1024 * 1024, // 4MB
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-gray-400",
        isDragActive && "border-blue-400 bg-blue-50",
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="space-y-2">
        <div className="text-gray-600">
          {isDragActive ? (
            <p>Drop the image here...</p>
          ) : (
            <p>
              Drag & drop your profile picture here, or{" "}
              <span className="text-blue-600 underline">browse</span>
            </p>
          )}
        </div>
        <p className="text-sm text-gray-500">
          Supports: JPG, PNG, GIF (max 4MB)
        </p>
      </div>
    </div>
  );
}