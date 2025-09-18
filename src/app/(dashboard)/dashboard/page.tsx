'use client'

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PropertyImageUpload } from '@/components/PropertyImageUpload'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'

function DashboardContent() {
  const { user, logout, loading } = useAuth()
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const router = useRouter()

  const handleSignOut = async () => {
    await logout()
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name || user?.email}</p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <strong>Email:</strong> {user?.email}
              </div>
              <div>
                <strong>Name:</strong> {user?.name || 'Not provided'}
              </div>
              <div>
                <strong>Role:</strong> {user?.role}
              </div>
              <div>
                <strong>User ID:</strong> {user?.userId}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full">View Properties</Button>
              <Button className="w-full" variant="outline">Create Property</Button>
              <Button className="w-full" variant="outline">Manage Applications</Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Test Image Upload</CardTitle>
            <CardDescription>Test the UploadThing integration</CardDescription>
          </CardHeader>
          <CardContent>
            <PropertyImageUpload
              onImagesUploaded={setUploadedImages}
              existingImages={uploadedImages}
            />
            {uploadedImages.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Uploaded Image URLs:</h4>
                <div className="space-y-1">
                  {uploadedImages.map((url, index) => (
                    <div key={index} className="text-sm text-muted-foreground break-all">
                      {url}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}