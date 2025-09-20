'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAppDispatch } from '@/state/redux'
import { setUser } from '@/state/authSlice'
import { toast } from 'sonner'

function AuthSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const token = searchParams.get('token')

    if (token) {
      // Decode the JWT to get user info (basic decode, not verification)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))

        const userData = {
          id: payload.sub,
          email: payload.email,
          role: payload.role,
          name: payload.name,
        }

        // Set user data in Redux store
        dispatch(setUser(userData))

        toast.success('Successfully signed in with Google!')

        // Check for redirect path
        const redirectPath = sessionStorage.getItem('redirectAfterLogin')
        if (redirectPath) {
          sessionStorage.removeItem('redirectAfterLogin')
          router.push(redirectPath)
        } else {
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Error processing auth token:', error)
        toast.error('Authentication failed')
        router.push('/auth/signin')
      }
    } else {
      toast.error('No authentication token received')
      router.push('/auth/signin')
    }
  }, [searchParams, dispatch, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing authentication...</p>
      </div>
    </div>
  )
}

export default function AuthSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <AuthSuccessContent />
    </Suspense>
  )
}