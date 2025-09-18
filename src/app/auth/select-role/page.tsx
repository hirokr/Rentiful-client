'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function SelectRolePage() {
  const [selectedRole, setSelectedRole] = useState<'MANAGER' | 'TENANT'>('TENANT')
  const [loading, setLoading] = useState(false)
  const [userInfo, setUserInfo] = useState<{ name: string; email: string } | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const tempUserId = searchParams.get('tempUserId')
    const email = searchParams.get('email')
    const name = searchParams.get('name')

    if (!tempUserId || !email || !name) {
      toast.error('Invalid authentication state')
      router.push('/auth/login')
      return
    }

    setUserInfo({ name, email })
  }, [searchParams, router])

  const handleRoleSelection = async () => {
    const tempUserId = searchParams.get('tempUserId')
    
    if (!tempUserId) {
      toast.error('Invalid authentication state')
      router.push('/auth/login')
      return
    }

    setLoading(true)

    try {
      const serverUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const response = await fetch(`${serverUrl}/auth/oauth/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tempUserId,
          role: selectedRole,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to complete registration')
      }

      const data = await response.json()
      
      // Redirect to success page with token
      router.push(`/auth/success?token=${data.token}`)
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

          <RadioGroup value={selectedRole} onValueChange={(value) => setSelectedRole(value as 'MANAGER' | 'TENANT')}>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 p-4 border rounded-lg">
                <RadioGroupItem value="TENANT" id="tenant" />
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
                <RadioGroupItem value="MANAGER" id="manager" />
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