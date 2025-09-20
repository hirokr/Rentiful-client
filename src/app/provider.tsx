"use client";

import StoreProvider from "@/state/redux";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <StoreProvider>
        {children}
        <Toaster />
      </StoreProvider>
    </SessionProvider>
  );
};

export default Provider;