'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";

export default function SelectRolePage() {
  const [selectedRole, setSelectedRole] = useState<'tenant' | 'manager'>('tenant')
  const [loading, setLoading] = useState(false)
  const [userInfo, setUserInfo] = useState<{
    name: string;
    email: string;
    image?: string;
    provider?: string;
    providerId?: string;
  } | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, update } = useSession()

  useEffect(() => {
    const email = searchParams.get('email')
    const name = searchParams.get('name')
    const image = searchParams.get('image')
    const provider = searchParams.get('provider')
    const providerId = searchParams.get('providerId')

    if (!email || !name || !provider || !providerId) {
      toast.error('Invalid authentication state')
      router.push('/auth/login')
      return
    }

    setUserInfo({ name, email, image: image || undefined, provider, providerId })
  }, [searchParams, router])

  const handleRoleSelection = async () => {
    if (!userInfo) {
      toast.error('Invalid authentication state')
      router.push('/auth/login')
      return
    }

    setLoading(true)

    try {
      // Create user with selected role
      const response = await fetch(`${SERVER_URL}/auth/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userInfo.email,
          name: userInfo.name,
          image: userInfo.image,
          provider: userInfo.provider,
          providerId: userInfo.providerId,
          role: selectedRole,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to complete registration')
      }

      const userData = await response.json()

      // Update the session to remove needsRoleSelection flag and add role
      await update({
        ...session,
        user: {
          ...session?.user,
          role: userData.role,
          needsRoleSelection: false,
        }
      })

      toast.success('Account setup completed successfully!')

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Role selection error:', error)
      toast.error(error.message || 'Failed to complete registration')
    } finally {
      setLoading(false)
    }
  }

  if (!userInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome, {userInfo.name}!</CardTitle>
          <CardDescription>
            Please select your role to complete your account setup
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-sm text-gray-600">
            <p>Email: {userInfo.email}</p>
          </div>

          <RadioGroup value={selectedRole} onValueChange={(value) => setSelectedRole(value as 'tenant' | 'manager')}>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 p-4 border rounded-lg">
                <RadioGroupItem value="tenant" id="tenant" />
                <div className="flex-1">
                  <Label htmlFor="tenant" className="font-medium">
                    Tenant
                  </Label>
                  <p className="text-sm text-gray-500">
                    I'm looking for properties to rent
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 p-4 border rounded-lg">
                <RadioGroupItem value="manager" id="manager" />
                <div className="flex-1">
                  <Label htmlFor="manager" className="font-medium">
                    Property Manager
                  </Label>
                  <p className="text-sm text-gray-500">
                    I manage properties and handle rentals
                  </p>
                </div>
              </div>
            </div>
          </RadioGroup>

          <Button
            onClick={handleRoleSelection}
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Setting up account...' : 'Continue'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}