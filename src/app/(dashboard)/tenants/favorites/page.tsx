"use client";

import Card from "@/components/Card";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import {
  useGetPropertiesQuery,
  useGetTenantQuery,
} from "@/state/api";
import { useSession } from "next-auth/react";
import React from "react";

const Favorites = () => {
  const { data: session } = useSession();
  const { data: tenant } = useGetTenantQuery(undefined, {
    skip: !session?.user?.id,
  });
  const {
    data: favoriteProperties,
    isLoading,
    error,
  } = useGetPropertiesQuery(
    { favoriteIds: tenant?.favorites?.map((fav: { id: string }) => fav.id) },
    { skip: !tenant?.favorites || tenant?.favorites.length === 0 }
  );

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading favorites</div>;

  return (
    <div className="dashboard-container">
      <Header
        title="Favorited Properties"
        subtitle="Browse and manage your saved property listings"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favoriteProperties?.map((property) => (
          <Card
            key={property.id}
            property={property}
            isFavorite={true}
            onFavoriteToggle={() => { }}
            showFavoriteButton={false}
            propertyLink={`/tenants/residences/${property.id}`}
          />
        ))}
      </div>
      {(!favoriteProperties || favoriteProperties.length === 0) && (
        <p>You don&lsquo;t have any favorited properties</p>
      )}
    </div>
  );
};

export default Favorites;
