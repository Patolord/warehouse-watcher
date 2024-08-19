'use client'

import React from 'react';
import { useQuery } from "convex/react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { api } from "../../../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageIcon, ArrowRightIcon, MoveIcon, PlusCircleIcon, MinusCircleIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import dynamic from 'next/dynamic';


export default function MaterialPage({
  params,
}: {
  params: { materialId: Id<"materials"> };
}) {
  const transactions = useQuery(api.transactions.queryTransactionsContainingMaterial, {
    materialId: params.materialId,
  });

  const material = useQuery(api.materials.getMaterialWithImageById, {
    materialId: params.materialId,
  });

  const materialVersions = useQuery(api.material_versions.getMaterialVersionsByMaterialId, {
    materialId: params.materialId,
  });

  if (!material || !transactions) {
    return <MaterialPageSkeleton />;
  }


  const getBadgeVariant = (actionType: string) => {
    switch (actionType.toLowerCase()) {
      case 'added':
        return 'added';
      case 'transfer':
        return 'transfer';
      case 'removed':
        return 'removed';
      default:
        return 'outline';
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType.toLowerCase()) {
      case 'added':
        return <PlusCircleIcon className="h-4 w-4 text-green-500" />;
      case 'removed':
        return <MinusCircleIcon className="h-4 w-4 text-red-500" />;
      case 'transfer':
        return <MoveIcon className="h-4 w-4 text-blue-500" />;
      default:
        return <MoveIcon className="h-4 w-4" />;
    }
  };

  return (
    <main className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Material Details</CardTitle>
          <Avatar className="h-14 w-14">
            {material.url ? (
              <AvatarImage src={material!.url} alt={material!.name} />
            ) : (
              <AvatarFallback>
                <ImageIcon className="h-8 w-8" />
              </AvatarFallback>
            )}
          </Avatar>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold">{material!.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            ID: {params.materialId}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            {transactions?.length || 0} transactions found for this material
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!transactions ? (
            <TransactionsSkeleton />
          ) : transactions.length > 0 ? (
            <ScrollArea className="h-[30vh]">
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <Card key={transaction.transaction_id} className="overflow-hidden">
                    <div className="flex items-center p-4">
                      <Badge
                        variant={getBadgeVariant(transaction.action_type!)}
                        className="mr-4"
                      >
                        {transaction.action_type || "No Action Type"}
                      </Badge>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center space-x-2 flex-grow">
                              <span className="truncate max-w-[100px]">{transaction.from_location_name}</span>
                              <ArrowRightIcon className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate max-w-[100px]">{transaction.to_location_name}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>From: {transaction.from_location_name}</p>
                            <p>To: {transaction.to_location_name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <div className="ml-auto flex items-center space-x-2">
                        {getActionIcon(transaction.action_type!)}
                        <span className="font-semibold">{transaction.quantity}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-center text-muted-foreground">No transactions found.</p>
          )}
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>Names</CardTitle>
          <CardDescription>
            {materialVersions?.length || 0} transactions found for this material
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!materialVersions ? (
            <TransactionsSkeleton />
          ) : materialVersions.length > 0 ? (
            <ScrollArea className="h-[30vh]">
              <div className="space-y-4">
                {materialVersions.map((version) => (
                  <Card key={version._id} className="overflow-hidden">
                    <div className="flex items-center p-4">

                      {version.name || "No Action Type"} -
                      {version.versionNumber} -
                      {version._creationTime}


                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-center text-muted-foreground">No transactions found.</p>
          )}
        </CardContent>
      </Card>

    </main>
  );
}

function MaterialPageSkeleton() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-14 w-14 rounded-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-6 w-1/4 mt-2" />
          <Skeleton className="h-4 w-1/5 mt-2" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-4 w-1/3" />
        </CardHeader>
        <CardContent>
          <TransactionsSkeleton />
        </CardContent>
      </Card>
    </div>
  );
}

function TransactionsSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <Card key={index}>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <Skeleton className="h-4 w-1/5 mt-2 ml-auto" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}