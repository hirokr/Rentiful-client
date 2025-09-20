# Authentication System Documentation

## Overview

This application uses NextAuth.js v5 for comprehensive authentication with support for:
- Credentials-based authentication (email/password)
- OAuth providers (Google, GitHub)
- Role-based access control (Tenant/Manager)
- Profile picture uploads
- Session management

## Features

### 1. Sign In (`/auth/signin`)
- Email/password authentication
- Role selection (Tenant/Manager)
- OAuth sign-in with Google and GitHub
- Automatic redirection after successful authentication

### 2. Registration (`/auth/register`)
- Complete user registration form
- Profile picture upload using FilePond
- Role selection during registration
- Phone number collection
- Automatic sign-in after registration

### 3. OAuth Role Selection (`/auth/role-selection`)
- Role selection page for OAuth users
- Completes OAuth registration with selected role
- Stores user data and creates session

### 4. Session Management
- JWT-based sessions
- Automatic session refresh
- Role-based access control
- Protected routes with middleware

### 5. User Profile (`/profile`)
- View and edit profile information
- Update profile picture
- Change personal details
- Role display with badges

### 6. Settings (`/settings`)
- Notification preferences
- Privacy settings
- Account management options

## Authentication Flow

### Credentials Authentication
1. User enters email, password, and selects role
2. Credentials are validated against backend API
3. JWT token is created with user information
4. User is redirected to dashboard

### OAuth Authentication
1. User selects OAuth provider and role
2. OAuth flow is initiated
3. User is redirected to role selection page
4. Role is selected and account is created
5. Session is established and user is redirected

## Components

### Core Components
- `useAuth()` - Authentication hook with session management
- `UserProfile` - User profile dropdown component
- `SessionProvider` - NextAuth session provider wrapper

### Pages
- `/auth/signin` - Sign in page
- `/auth/register` - Registration page
- `/auth/role-selection` - OAuth role selection
- `/profile` - User profile management
- `/settings` - User settings
- `/dashboard` - Protected dashboard

## Configuration

### Environment Variables
```env
# NextAuth Configuration
AUTH_SECRET="your-secret-key"
NEXTAUTH_URL=http://localhost:3000
NEST_API_URL=http://localhost:3001

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# API URLs
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### NextAuth Configuration (`src/auth.ts`)
- Configured providers (Credentials, Google, GitHub)
- JWT strategy for sessions
- Custom callbacks for role handling
- OAuth role selection flow

## API Integration

### Backend Endpoints Required
- `POST /auth/login` - Credentials authentication
- `POST /auth/manual_register` - User registration
- `POST /auth/oauth-login` - OAuth user creation
- `PUT /user/profile` - Profile updates
- `POST /upload/profile` - Profile picture upload

## Security Features

### Route Protection
- Middleware-based route protection
- Automatic redirects for unauthenticated users
- Role-based access control

### File Upload Security
- Image type validation
- File size limits (5MB)
- Secure file storage in public/uploads

### Session Security
- JWT tokens with secure secrets
- Automatic session expiration
- CSRF protection via NextAuth

## Usage Examples

### Using Authentication Hook
```tsx
import { useRequireAuth } from '@/hooks/useAuth'

function ProtectedComponent() {
  const { user, isLoading } = useRequireAuth()
  
  if (isLoading) return <div>Loading...</div>
  
  return <div>Welcome, {user.name}!</div>
}
```

### Checking User Role
```tsx
import { useAuth } from '@/hooks/useAuth'

function RoleBasedComponent() {
  const { user } = useAuth()
  
  if (user?.role === 'MANAGER') {
    return <ManagerDashboard />
  }
  
  return <TenantDashboard />
}
```

### Sign Out
```tsx
import { signOut } from 'next-auth/react'

function SignOutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: '/auth/signin' })}>
      Sign Out
    </button>
  )
}
```

## File Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── signin/page.tsx
│   │   ├── register/page.tsx
│   │   └── role-selection/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   └── upload/profile/route.ts
│   ├── dashboard/page.tsx
│   ├── profile/page.tsx
│   └── settings/page.tsx
├── components/
│   ├── UserProfile.tsx
│   └── ui/ (shadcn components)
├── hooks/
│   └── useAuth.ts
├── auth.ts
├── middleware.ts
└── types/index.d.ts
```

## Troubleshooting

### Common Issues
1. **OAuth not working**: Check client IDs and secrets in environment variables
2. **Session not persisting**: Verify AUTH_SECRET is set correctly
3. **File upload failing**: Ensure upload directory exists and has write permissions
4. **Role not updating**: Check JWT callback implementation

### Debug Mode
Enable NextAuth debug mode by adding to environment:
```env
NEXTAUTH_DEBUG=true
```

## Future Enhancements

- Two-factor authentication
- Password reset functionality
- Social login with more providers
- Advanced role permissions
- Audit logging
- Session management dashboard