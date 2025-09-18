"use client";

import { useEffect } from "react";
import StoreProvider from "@/state/redux";
import { Toaster } from "@/components/ui/sonner";
import { useAppDispatch } from "@/state/redux";
import { initializeAuth } from "@/state/authSlice";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize auth state from localStorage on app start
    dispatch(initializeAuth());
  }, [dispatch]);

  return <>{children}</>;
}

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <AuthInitializer>
        {children}
        <Toaster />
      </AuthInitializer>
    </StoreProvider>
  );
};

export default Provider;