import { NextResponse, type NextRequest } from 'next/server'
import { auth } from '@/auth'

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // If the user is on "/" redirect to "/landing"
  if (pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = "/landing";
    return NextResponse.redirect(url);
  }

  const isAuthenticated = !!req.auth;
  const needsRoleSelection = req.auth?.user?.needsRoleSelection;

  // Protected routes
  const protectedRoutes = ['/dashboard', '/profile', '/properties/create', '/managers', '/tenants']
  const authRoutes = ['/auth/login', '/auth/register']
  const roleSelectionRoute = '/auth/select-role'

  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.some(route =>
    pathname.startsWith(route)
  )
  const isRoleSelectionRoute = pathname.startsWith(roleSelectionRoute)

  // If user needs role selection and is not on role selection page
  if (isAuthenticated && needsRoleSelection && !isRoleSelectionRoute) {
    const redirectUrl = new URL('/auth/select-role', req.url)
    redirectUrl.searchParams.set('email', req.auth?.user.email || '')
    redirectUrl.searchParams.set('name', req.auth?.user.name || '')
    redirectUrl.searchParams.set('image', req.auth?.user.image || '')
    redirectUrl.searchParams.set('provider', req.auth?.user.provider || '')
    redirectUrl.searchParams.set('providerId', req.auth?.user.providerId || '')
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const redirectUrl = new URL('/auth/login', req.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect authenticated users from auth routes (except role selection)
  if (isAuthRoute && isAuthenticated && !needsRoleSelection) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Redirect users who don't need role selection away from role selection page
  if (isRoleSelectionRoute && isAuthenticated && !needsRoleSelection) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
