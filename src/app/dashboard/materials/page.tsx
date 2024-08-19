"use client";

import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";

import { columns } from "./_components/columns";
import { CreateButton } from "./_components/create-button";
import { DataTable } from "./_components/data-table";

export default function MaterialsPage() {

  const materials = useQuery(api.materials.getMaterialsWithImageByUser, {
    userId: "user1",
  }
  );
  const isLoading = materials === undefined;

  return (<>

    <div className="flex flex-1 py-4 h-screen sm:h-fit flex-col space-y-2 px-4">
      {isLoading && (
        <div className="flex flex-col gap-8 w-full items-center mt-12">
          <Loader2 className="h-32 w-32 animate-spin text-gray-700" />
          Carregando tabela de materiais cadastrados.
        </div>
      )}

      {!isLoading && materials.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl">
              Materiais Cadastrados
            </h1>
            <CreateButton variantText="default" />
          </div>
          {/* Desktop */}
          <div className="container mx-auto">
            <DataTable columns={columns} data={materials} />
          </div>
        </>
      )}

      {!isLoading && materials.length === 0 && (
        <div className="flex flex-col gap-8 w-full items-center mt-12">
          <div className="2xl">Nenhum material cadastrado.</div>
          <CreateButton variantText="default" />
        </div>
      )}
    </div>

  </>
  );

}
