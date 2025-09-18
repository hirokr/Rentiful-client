'use client'

import { useState } from 'react'
import { UploadDropzone } from '@/lib/uploadthing'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { X, User, Upload } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ProfileImageUploadProps {
  onImageUploaded: (url: string | null) => void
  existingImage?: string | null
  userName?: string
}

export function ProfileImageUpload({
  onImageUploaded,
  existingImage = null,
  userName = ''
}: ProfileImageUploadProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(existingImage)
  const [isUploading, setIsUploading] = useState(false)

  const handleUploadComplete = (res: any[]) => {
    if (res && res.length > 0) {
      const imageUrl = res[0].url
      setUploadedImage(imageUrl)
      onImageUploaded(imageUrl)
      toast.success('Profile image uploaded successfully')
    }
    setIsUploading(false)
  }

  const handleUploadError = (error: Error) => {
    console.error('Upload error:', error)
    toast.error('Failed to upload profile image')
    setIsUploading(false)
  }

  const removeImage = () => {
    setUploadedImage(null)
    onImageUploaded(null)
    toast.success('Profile image removed')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Profile Picture (Optional)</h4>
      </div>

      <div className="flex flex-col items-center space-y-4">
        {/* Profile Image Preview */}
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage src={uploadedImage || undefined} />
            <AvatarFallback className="text-lg">
              {userName ? userName.charAt(0).toUpperCase() : <User className="h-8 w-8" />}
            </AvatarFallback>
          </Avatar>

          {uploadedImage && (
            <Button
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
              onClick={removeImage}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Upload Area */}
        {!uploadedImage && (
          <Card className="w-full">
            <CardContent className="p-4">
              <UploadDropzone
                endpoint="profileImageUploader"
                onClientUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
                onUploadBegin={() => setIsUploading(true)}
                appearance={{
                  container: "border-dashed border-2 border-gray-300 rounded-lg p-4",
                  uploadIcon: "text-gray-400",
                  label: "text-gray-600 text-sm",
                  allowedContent: "text-gray-500 text-xs",
                }}
                content={{
                  label: isUploading ? "Uploading..." : "Choose profile picture",
                  allowedContent: "Image up to 2MB",
                }}
              />
            </CardContent>
          </Card>
        )}

        {uploadedImage && (
          <Button
            variant="outline"
            size="sm"
            onClick={removeImage}
            className="text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Remove Image
          </Button>
        )}
      </div>
    </div>
  )
}