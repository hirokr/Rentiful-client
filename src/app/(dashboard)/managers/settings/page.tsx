"use client";

import SettingsForm from "@/components/SettingsForm";
import {
  useGetManagerQuery,
  useUpdateManagerSettingsMutation,
} from "@/state/api";
import { useSession } from "next-auth/react";
import React from "react";

const ManagerSettings = () => {
  const { data: session } = useSession();
  const { data: manager, isLoading } = useGetManagerQuery(undefined, {
    skip: !session?.user?.id,
  });
  const [updateManager] = useUpdateManagerSettingsMutation();

  if (isLoading) return <>Loading...</>;

  const initialData = {
    name: manager?.name,
    email: manager?.email,
    phoneNumber: manager?.phoneNumber,
  };

  const handleSubmit = async (data: typeof initialData) => {
    await updateManager(data);
  };

  return (
    <SettingsForm
      initialData={initialData}
      onSubmit={handleSubmit}
      userType='manager'
    />
  );
};

export default ManagerSettings;
