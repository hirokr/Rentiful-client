"use client";

import { useRequireAuth } from "@/hooks/useAuth";
import { UserProfile } from "@/components/UserProfile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, isLoading } = useRequireAuth();
  const router = useRouter();
  router.push("/");

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will be redirected by useRequireAuth
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <header className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <h1 className='text-xl font-semibold'>Dashboard</h1>
            <UserProfile />
          </div>
        </div>
      </header>

      <main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
        <div className='px-4 py-6 sm:px-0'>
          <Card>
            <CardHeader>
              <CardTitle>Welcome back, {user.name}!</CardTitle>
              <CardDescription>
                You are signed in as a{" "}
                {user.role === "MANAGER" ? "Manager" : "Tenant"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>Email</h3>
                  <p className='mt-1 text-sm text-gray-900'>{user.email}</p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>Role</h3>
                  <p className='mt-1 text-sm text-gray-900'>
                    {user.role === "MANAGER" ? "Property Manager" : "Tenant"}
                  </p>
                </div>
                {user.image && (
                  <div>
                    <h3 className='text-sm font-medium text-gray-500'>
                      Profile Picture
                    </h3>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user.image}
                      alt='Profile'
                      className='mt-1 h-20 w-20 rounded-full object-cover'
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
