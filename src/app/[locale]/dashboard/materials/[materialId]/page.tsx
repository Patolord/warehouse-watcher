'use client'

import React from 'react';
import { useQuery } from "convex/react";
import { Doc, Id } from "../../../../../../convex/_generated/dataModel";
import { api } from "../../../../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageIcon, ArrowRightIcon, MoveIcon, PlusCircleIcon, MinusCircleIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslations } from 'next-intl';
import { milisecondsToDate } from '@/lib/utils';
import Image from 'next/image';
import { UploadModal } from '../_components/upload-modal';

export default function MaterialPage({
  params,
}: {
  params: { materialId: Id<"materials"> };
}) {

  const t = useTranslations('MaterialIDPage');

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

  const getBadgeVariant = (actionType: string | undefined) => {
    switch (actionType?.toLowerCase()) {
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
      <Card className="overflow-hidden">
        <div className="flex items-start space-x-4 p-6">
          <div className="relative h-24 w-24 flex-shrink-0">
            {material.url ? (
              <Image
                src={material.url}
                alt={material.name}
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            ) : (
              <div className="h-full w-full bg-muted flex items-center justify-center rounded-md">
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            <div className="absolute -bottom-3 right-0 -mt-2 -mr-2">
              <UploadModal materialId={material._id} />
            </div>
          </div>
          <CardContent className="flex-grow p-0">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">{material.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('id')}: {material._id}
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                {t('materialDetails')}
              </Badge>
            </div>
          </CardContent>
        </div>
      </Card>



      <Card>
        <CardHeader>
          <CardTitle>{t('transactionsTitle')}</CardTitle>
          <CardDescription>
            {transactions?.length || 0} {t('transactionsFound')}
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
                        {t(`actionType.${transaction.action_type!.toLowerCase()}`) || t('noActionType')}
                      </Badge>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center space-x-2 flex-grow">
                              <span className="truncate hover:text-clip ">{transaction.from_location_name}</span>
                              <ArrowRightIcon className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate hover:text-clip">{transaction.to_location_name}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t('from')}: {transaction.from_location_name}</p>
                            <p>{t('to')}: {transaction.to_location_name}</p>
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
            <p className="text-center text-muted-foreground">{t('noTransactionsFound')}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('namesTitle')}</CardTitle>
          <CardDescription>
            {materialVersions?.length || 0} {t('versionsFound')}
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
                      <div className="flex-grow">
                        <p className="font-semibold">{version.versionNumber} {"| "}{version.name || t('noName')}</p>

                      </div>
                      <p className="text-sm text-muted-foreground">{milisecondsToDate(version._creationTime)}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-center text-muted-foreground">{t('noVersionsFound')}</p>
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
