"use client";

import { api } from "../../../../convex/_generated/api";
import { useQuery, useConvexAuth } from "convex/react";
import { useState, useMemo, useCallback, useEffect } from "react";
import { columns } from "./_components/columns";
import { CreateButton } from "./_components/create-button";
import { DataTable } from "./_components/data-table";
import MaterialCard from "./_components/material-card";
import SearchFilterControls from "./_components/search";
import { useMediaQuery } from "@/hooks/use-media-query";
import { types } from "./_components/data-table-toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { useMaterialsStore } from "@/store/materialsStore";

export default function MaterialsPage() {
  const { isAuthenticated } = useConvexAuth();
  const { materials, setMaterials, isLoading, setIsLoading } =
    useMaterialsStore();
  const queryResult = useQuery(api.materials.getMaterialsWithImageByUser);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [mobileSearchTerm, setMobileSearchTerm] = useState("");
  const [mobileSelectedType, setMobileSelectedType] = useState("all");

  useEffect(() => {
    if (queryResult) {
      setMaterials(queryResult);
      setIsLoading(false);
    }
  }, [queryResult, setMaterials, setIsLoading]);

  const filteredMobileMaterials = useMemo(() => {
    if (!materials || isDesktop) return [];
    return materials.filter((material) => {
      const matchesSearch = material.name
        .toLowerCase()
        .includes(mobileSearchTerm.toLowerCase());
      const matchesType =
        mobileSelectedType === "all" || material.type === mobileSelectedType;
      return matchesSearch && matchesType;
    });
  }, [materials, mobileSearchTerm, mobileSelectedType, isDesktop]);

  const LoadingState = useCallback(
    () => (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} className="h-24 w-full" />
        ))}
      </div>
    ),
    []
  );

  if (!isAuthenticated) {
    return <div>Please log in to view materials.</div>;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold md:text-2xl">
          Registered Materials
        </h1>
        <CreateButton variantText="default" />
      </div>
      {!isDesktop && (
        <SearchFilterControls
          searchTerm={mobileSearchTerm}
          onSearchChange={setMobileSearchTerm}
          selectedType={mobileSelectedType}
          onTypeChange={setMobileSelectedType}
          types={types}
        />
      )}
      {isDesktop ? (
        <div className="container mx-auto">
          {isLoading ? (
            <LoadingState />
          ) : (
            <DataTable columns={columns} data={materials || []} />
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {isLoading ? (
            <LoadingState />
          ) : filteredMobileMaterials.length > 0 ? (
            filteredMobileMaterials.map((material) => (
              <MaterialCard key={material._id} material={material} />
            ))
          ) : (
            <div>No materials found.</div>
          )}
        </div>
      )}
    </>
  );
}
