"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { X, Upload } from "lucide-react";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner";

// Extend window interface for upload callback
declare global {
  interface Window {
    uploadCallback?: ((urls: string[] | null) => void) | null;
  }
}

interface PropertyImageUploadProps {
  onImagesChange: (images: StagedImage[]) => void;
  maxImages?: number;
}

export interface StagedImage {
  id: string;
  file: File;
  preview: string;
  uploaded?: boolean;
  url?: string;
}

export const PropertyImageUpload: React.FC<PropertyImageUploadProps> = ({
  onImagesChange,
  maxImages = 10,
}) => {
  const [stagedImages, setStagedImages] = useState<StagedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { startUpload } = useUploadThing("propertyImages", {
    onClientUploadComplete: (res) => {
      console.log("Upload completed:", res);
      setIsUploading(false);

      // Update staged images with uploaded URLs
      setStagedImages(prev => {
        const updated = prev.map(img => {
          const uploadedFile = res?.find(r => r.name === img.file.name);
          if (uploadedFile) {
            return { ...img, uploaded: true, url: uploadedFile.url };
          }
          return img;
        });
        onImagesChange(updated);
        return updated;
      });

      // Notify parent component with uploaded URLs
      const uploadedUrls = res?.map(r => r.url) || [];
      const uploadEvent = window.uploadCallback;
      if (uploadEvent) {
        uploadEvent(uploadedUrls);
        window.uploadCallback = null;
      }
    },
    onUploadError: (error) => {
      console.error("Upload error:", error);
      setIsUploading(false);
      toast.error("Failed to upload images. Please try again.");

      // Notify parent component of failure
      const uploadEvent = window.uploadCallback;
      if (uploadEvent) {
        uploadEvent(null);
        window.uploadCallback = null;
      }
    },
  });

  // Listen for upload trigger from parent component
  React.useEffect(() => {
    const handleUploadTrigger = (event: CustomEvent) => {
      window.uploadCallback = event.detail.callback;
      uploadImages();
    };

    window.addEventListener('uploadStagedImages', handleUploadTrigger as EventListener);

    return () => {
      window.removeEventListener('uploadStagedImages', handleUploadTrigger as EventListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages: StagedImage[] = acceptedFiles.slice(0, maxImages - stagedImages.length).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      uploaded: false,
    }));

    setStagedImages(prev => {
      const updated = [...prev, ...newImages];
      onImagesChange(updated);
      return updated;
    });
  }, [stagedImages.length, maxImages, onImagesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: maxImages,
    disabled: stagedImages.length >= maxImages,
  });

  const removeImage = (id: string) => {
    setStagedImages(prev => {
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      const updated = prev.filter(img => img.id !== id);
      onImagesChange(updated);
      return updated;
    });
  };

  const uploadImages = async () => {
    const filesToUpload = stagedImages.filter(img => !img.uploaded).map(img => img.file);
    if (filesToUpload.length === 0) {
      toast.info("No new images to upload");
      return;
    }

    setIsUploading(true);
    try {
      await startUpload(filesToUpload);
    } catch (error) {
      console.error("Upload failed:", error);
      setIsUploading(false);
      toast.error("Failed to upload images");
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${stagedImages.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-2">
          <Upload className="w-8 h-8 text-gray-400" />
          <div className="text-sm text-gray-600">
            {isDragActive ? (
              <p>Drop the images here...</p>
            ) : (
              <div>
                <p>Drag & drop images here, or click to select</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stagedImages.length}/{maxImages} images selected
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Staged Images Grid */}
      {stagedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {stagedImages.map((image) => (
            <div key={image.id} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.preview}
                  alt="Property preview"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeImage(image.id)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Upload status indicator */}
              <div className="absolute bottom-2 left-2">
                {image.uploaded ? (
                  <div className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                    ✓ Ready
                  </div>
                ) : (
                  <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    Selected
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Status */}
      {isUploading && (
        <div className="text-center py-2">
          <div className="text-sm text-blue-600">Uploading images...</div>
        </div>
      )}

      {/* Info */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Maximum {maxImages} images allowed</p>
        <p>• Supported formats: JPEG, PNG, WebP</p>
        <p>• Maximum file size: 8MB per image</p>
        <p>• Images will be uploaded automatically when you create the property</p>
      </div>
    </div>
  );
};