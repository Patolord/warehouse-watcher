"use client";

import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { FixedSizeList as List } from 'react-window';

import { columns } from "./_components/columns";
import { CreateButton } from "./_components/create-button";
import { DataTable } from "./_components/data-table";
import MaterialCard from "./_components/material-card";
import SearchFilterControls from "./_components/search";
import { useMediaQuery } from "@/hooks/use-media-query";
import { types } from "./_components/data-table-toolbar";
import { Badge } from "@/components/ui/badge";

const CARD_HEIGHT = 170; // Adjust this based on your card's actual height

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

  const renderCard = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <MaterialCard material={filteredMobileMaterials[index]} />
    </div>
  );

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
            <div className=" mx-auto">
              <DataTable columns={columns} data={materials} />
            </div>
          ) : (
            <List
              height={window.innerHeight - 240} // Adjust this value based on your layout
              itemCount={filteredMobileMaterials.length}
              itemSize={CARD_HEIGHT}
              width="100%"
            >
              {renderCard}
            </List>
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
    <div className="flex flex-1 py-4 h-screen sm:h-fit flex-col space-y-2 px-4">
      {renderContent()}
    </div>
  );
}