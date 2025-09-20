'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface PendingOAuthUser {
  provider: string
  providerId: string
  email: string
  name: string
  image?: string
}

export default function RoleSelectionPage() {
  const [role, setRole] = useState<'TENANT' | 'MANAGER'>('TENANT')
  const [loading, setLoading] = useState(false)
  const [pendingUser, setPendingUser] = useState<PendingOAuthUser | null>(null)
  const router = useRouter()
  const { update } = useSession()

  useEffect(() => {
    const storedUser = sessionStorage.getItem('pendingOAuthUser')
    if (storedUser) {
      setPendingUser(JSON.parse(storedUser))
    } else {
      // No pending OAuth user, redirect to sign in
      router.push('/auth/signin')
    }
  }, [router])

  const handleRoleSelection = async () => {
    if (!pendingUser) return

    setLoading(true)
    try {
      // Complete OAuth registration with selected role
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/oauth-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: pendingUser.provider,
          providerId: pendingUser.providerId,
          email: pendingUser.email,
          name: pendingUser.name,
          imageUrl: pendingUser.image,
          role,
        }),
      })

      if (response.ok) {
        // Clear pending user data
        sessionStorage.removeItem('pendingOAuthUser')

        // Update session with role
        await update({ role })

        toast.success('Account created successfully!')
        router.push('/dashboard')
      } else {
        toast.error('Failed to create account')
      }
    } catch {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!pendingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Select Your Role</CardTitle>
          <CardDescription>
            Welcome {pendingUser.name}! Please select your role to complete the registration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={role} onValueChange={(value: 'TENANT' | 'MANAGER') => setRole(value)}>
            <div className="flex items-center space-x-2 p-4 border rounded-lg">
              <RadioGroupItem value="TENANT" id="tenant" />
              <Label htmlFor="tenant" className="flex-1 cursor-pointer">
                <div className="font-medium">Tenant</div>
                <div className="text-sm text-muted-foreground">
                  Looking for properties to rent
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-4 border rounded-lg">
              <RadioGroupItem value="MANAGER" id="manager" />
              <Label htmlFor="manager" className="flex-1 cursor-pointer">
                <div className="font-medium">Manager</div>
                <div className="text-sm text-muted-foreground">
                  Managing properties and tenants
                </div>
              </Label>
            </div>
          </RadioGroup>

          <Button onClick={handleRoleSelection} className="w-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Continue'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}