"use client";

import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { useState, useMemo } from "react";

import { columns } from "./_components/columns";
import { CreateButton } from "./_components/create-button";
import { DataTable } from "./_components/data-table";
import MaterialCard from "./_components/material-card";
import SearchFilterControls from "./_components/search";
import { useMediaQuery } from "@/hooks/use-media-query";
import { types } from "./_components/data-table-toolbar";

export default function MaterialsPage() {
  const materials = useQuery(api.materials.getMaterialsWithImageByUser);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [mobileSearchTerm, setMobileSearchTerm] = useState("");
  const [mobileSelectedType, setMobileSelectedType] = useState("all");

  const filteredMobileMaterials = useMemo(() => {
    if (!materials || isDesktop) return [];
    return materials.filter((material) => {
      const matchesSearch = material.name.toLowerCase().includes(mobileSearchTerm.toLowerCase());
      const matchesType = mobileSelectedType === "all" || material.type === mobileSelectedType;
      return matchesSearch && matchesType;
    });
  }, [materials, mobileSearchTerm, mobileSelectedType, isDesktop]);

  const isLoading = materials === undefined;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col gap-8 w-full items-center mt-12">
          <Loader2 className="h-32 w-32 animate-spin text-gray-700" />
          Carregando tabela de materiais cadastrados.
        </div>
      );
    }

    if (materials && materials.length > 0) {
      return (
        <>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold md:text-2xl">
              Materiais Cadastrados
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
              <DataTable columns={columns} data={materials} />
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMobileMaterials.map((material, index) => (
                <MaterialCard key={index} material={material} />
              ))}
            </div>
          )}
        </>
      );
    }

    return (
      <div className="flex flex-col gap-8 w-full items-center mt-12">
        <div className="2xl">Nenhum material cadastrado.</div>
        <CreateButton variantText="default" />
      </div>
    );
  };

  return (
    <div>
      {renderContent()}
    </div>
  );
}