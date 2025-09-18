"use client";

import { SessionProvider } from "next-auth/react";
import StoreProvider from "@/state/redux";
import { Toaster } from "@/components/ui/sonner";

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