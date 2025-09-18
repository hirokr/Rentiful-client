'use client'

import { useState } from 'react'
import { UploadDropzone } from '@/lib/uploadthing'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { X, Upload } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface PropertyImageUploadProps {
  onImagesUploaded: (urls: string[]) => void
  existingImages?: string[]
  maxImages?: number
}

export function PropertyImageUpload({ 
  onImagesUploaded, 
  existingImages = [], 
  maxImages = 10 
}: PropertyImageUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>(existingImages)
  const [isUploading, setIsUploading] = useState(false)

  const handleUploadComplete = (res: any[]) => {
    const newUrls = res.map(file => file.url)
    const allImages = [...uploadedImages, ...newUrls]
    
    if (allImages.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`)
      return
    }
    
    setUploadedImages(allImages)
    onImagesUploaded(allImages)
    toast.success(`${newUrls.length} image(s) uploaded successfully`)
    setIsUploading(false)
  }

  const handleUploadError = (error: Error) => {
    console.error('Upload error:', error)
    toast.error('Failed to upload images')
    setIsUploading(false)
  }

  const removeImage = (indexToRemove: number) => {
    const newImages = uploadedImages.filter((_, index) => index !== indexToRemove)
    setUploadedImages(newImages)
    onImagesUploaded(newImages)
    toast.success('Image removed')
  }

  const canUploadMore = uploadedImages.length < maxImages

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Property Images</h3>
        <span className="text-sm text-muted-foreground">
          {uploadedImages.length}/{maxImages} images
        </span>
      </div>

      {/* Existing Images Grid */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploadedImages.map((url, index) => (
            <Card key={index} className="relative group">
              <CardContent className="p-2">
                <div className="relative aspect-square">
                  <Image
                    src={url}
                    alt={`Property image ${index + 1}`}
                    fill
                    className="object-cover rounded-md"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Dropzone */}
      {canUploadMore && (
        <Card>
          <CardContent className="p-6">
            <UploadDropzone
              endpoint="propertyImageUploader"
              onClientUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
              onUploadBegin={() => setIsUploading(true)}
              appearance={{
                container: "border-dashed border-2 border-gray-300 rounded-lg p-6",
                uploadIcon: "text-gray-400",
                label: "text-gray-600",
                allowedContent: "text-gray-500 text-sm",
              }}
              content={{
                label: isUploading ? "Uploading..." : "Choose images or drag and drop",
                allowedContent: `Images up to 4MB (${maxImages - uploadedImages.length} remaining)`,
              }}
            />
          </CardContent>
        </Card>
      )}

      {!canUploadMore && (
        <Card>
          <CardContent className="p-6 text-center">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Maximum number of images reached</p>
            <p className="text-sm text-gray-500">Remove some images to upload more</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}