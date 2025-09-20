"use client";

import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/AppSidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // if (status === "unauthenticated") {
    //   // Redirect to login if not authenticated
    //   router.push("/auth/signin");
    //   return;
    // }

    if (session?.user) {
      const userRole = session.user.role?.toLowerCase();
      if (
        (userRole === "manager" && pathname.startsWith("/tenants")) ||
        (userRole === "tenant" && pathname.startsWith("/managers"))
      ) {
        router.push(
          userRole === "manager"
            ? "/managers/properties"
            : "/tenants/favorites",
          { scroll: false }
        );
      } else {
        setIsLoading(false);
      }
    }
  }, [session, status, router, pathname]);

  // if (status === "loading" || isLoading) return <>Loading...</>;
  // if (!session?.user?.role) return null;

  return (
    <SidebarProvider>
      <div className='min-h-screen w-full bg-primary-100' >
        <Navbar />
        <div style={{ marginTop: `${NAVBAR_HEIGHT}px` }}>
          <main className='flex'>
            <Sidebar userType={
              session?.user?.role?.toLowerCase() === "manager" ? "manager" : "tenant"
            } />
            <div className='flex-grow transition-all duration-300'>
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
