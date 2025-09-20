
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useOptionalAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  const { isAuthenticated, isLoading } = useOptionalAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to Real Estate App</CardTitle>
          <CardDescription>
            Sign in to access your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/auth/signin" className="block">
            <Button className="w-full">Sign In</Button>
          </Link>
          <Link href="/auth/register" className="block">
            <Button variant="outline" className="w-full">Create Account</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
