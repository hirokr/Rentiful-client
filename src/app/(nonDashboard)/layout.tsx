"use client";
import Navbar from "@/components/Navbar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { useGetAuthUserQuery } from "@/state/api";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  // const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  // const router = useRouter();
  // const pathname = usePathname();
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   console.log(authUser);
  //   if (authUser) {
  //     const userRole = authUser.userRole?.toLowerCase();
  //     console.log(userRole, pathname);
  //     if (
  //       (userRole === "manager" && pathname.startsWith("/search")) ||
  //       (userRole === "manager" && pathname.startsWith("/"))
  //     ) {
  //       router.push("/manager/properties", { scroll: false });
  //     } else {
  //       setIsLoading(false);
  //     }
  //   }
  // }, [authUser, router, pathname]);

  // if (authLoading || isLoading) return <>Loading...</>;

  return (
    <div className='h-full w-full'>
      <Navbar />
      <main
        className={`h-full flex w-full flex-col`}
        style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}
      >
        {children}
      </main>
    </div>
  );
};

export default layout;
