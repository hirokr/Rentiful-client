import { useSession, signOut } from 'next-auth/react';

export const useAuth = () => {
  const { data: session, status } = useSession();

  const logout = async () => {
    await signOut({ callbackUrl: '/auth/login' });
  };

  return {
    user: session?.user ? {
      userId: session.user.id,
      email: session.user.email || '',
      name: session.user.name || '',
      role: session.user.role || '',
      image: session.user.image,
      provider: session.user.provider,
      needsRoleSelection: session.user.needsRoleSelection,
    } : null,
    session,
    isAuthenticated: status === 'authenticated' && !session?.user?.needsRoleSelection,
    loading: status === 'loading',
    needsRoleSelection: session?.user?.needsRoleSelection || false,
    logout,
  };
};