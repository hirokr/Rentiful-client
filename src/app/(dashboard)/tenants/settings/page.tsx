"use client";

import SettingsForm from "@/components/SettingsForm";
import {
  useGetTenantQuery,
  useUpdateTenantSettingsMutation,
} from "@/state/api";
import { useSession } from "next-auth/react";
import React from "react";

const TenantSettings = () => {
  const { data: session } = useSession();
  const { data: tenant, isLoading } = useGetTenantQuery(
    undefined,
    { skip: !session?.user?.id }
  );
  const [updateTenant] = useUpdateTenantSettingsMutation();

  if (isLoading) return <>Loading...</>;

  const initialData = {
    name: tenant?.name || "name",
    email: tenant?.email || "email",
    phoneNumber: tenant?.phoneNumber || "phone number",
  };

  const handleSubmit = async (data: typeof initialData) => {
    await updateTenant(data);
  };

  return (
    <SettingsForm
      initialData={initialData}
      onSubmit={handleSubmit}
      userType="tenant"
    />
  );
};

export default TenantSettings;
