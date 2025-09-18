'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAppDispatch } from '@/state/redux'
import { setAuthData } from '@/state/authSlice'
import { toast } from 'sonner'

export default function AuthSuccessPage() {
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
          userId: payload.sub,
          email: payload.email,
          role: payload.role,
          name: payload.name,
        }

        // Set auth data in Redux store
        dispatch(setAuthData({ user: userData, token }))

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
        router.push('/auth/login')
      }
    } else {
      toast.error('No authentication token received')
      router.push('/auth/login')
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