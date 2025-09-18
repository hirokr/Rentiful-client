'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

export default function AuthSuccessPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      toast.success('Successfully authenticated!')

      if (session.user.needsRoleSelection) {
        // Redirect to role selection
        const params = new URLSearchParams({
          email: session.user.email || '',
          name: session.user.name || '',
          image: session.user.image || '',
          provider: session.user.provider || '',
          providerId: session.user.providerId || '',
        })
        router.push(`/auth/select-role?${params.toString()}`)
      } else {
        // Redirect to dashboard
        router.push('/dashboard')
      }
    } else if (status === 'unauthenticated') {
      toast.error('Authentication failed')
      router.push('/auth/login')
    }
  }, [session, status, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing authentication...</p>
      </div>
    </div>
  )
}