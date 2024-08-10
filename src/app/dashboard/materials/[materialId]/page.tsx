"use client";

import { useQuery } from "convex/react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { api } from "../../../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { ImageIcon } from "lucide-react";



export default function MaterialPage({
  params,
}: {
  params: { materialId: Id<"materials"> };
}) {
  // Convex Queries
  const transactions = useQuery(api.transactions.queryTransactionsContainingMaterial, {
    materialId: params.materialId,
  });

  const material = useQuery(api.materials.getMaterialWithImageById, {
    materialId: params.materialId,
  });

  if (!material) {
    return []
  }

  if (!transactions) {
    return <div>Carregando...</div>
  }

  return (
    <main className="flex flex-1 py-4 h-screen sm:h-fit flex-col space-y-2">
      {transactions.length > 0 ? (
        <div className="flex flex-col items-center justify-between">
          <h1 className="text-lg font-semibold md:text-2xl">
            Transações de material: {material.name}
            {material.url ? <Image
              src={material.url}
              alt={material.name}
              width={35}
              height={35}
            /> : <ImageIcon />}


          </h1>
          <div className="flex flex-col gap-8 w-full items-center mt-12">
            {transactions.map((transaction) => (
              <Card key={transaction.transaction_id} className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>{transaction.action_type || "No Action Type"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>From: {transaction.from_location_name}</p>
                  <p>To: {transaction.to_location_name}</p>
                  <p>Quantity: {transaction.quantity}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-8 w-full items-center mt-12">
          <div className="2xl">Nenhuma transação encontrada.</div>
        </div>
      )}
    </main>
  );
}
