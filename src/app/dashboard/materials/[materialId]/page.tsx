"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ImageIcon,
  ArrowRightIcon,
  MoveIcon,
  PlusCircleIcon,
  MinusCircleIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { milisecondsToDate } from "@/lib/utils";
import Image from "next/image";
import { UploadModal } from "../_components/upload-modal";

import AdditionalAttributesCard from "./AdditionalAttributesCard";
import EditAttributesModal from "./EditAttributesModal";
import AddAttributeModal from "./AddAttributeModal";
import { MaterialQRCode } from "@/components/MaterialQRCode";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

export default function MaterialPage({
  params,
}: {
  params: { materialId: Id<"materials"> };
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const transactions = useQuery(
    api.transactions.queryTransactionsContainingMaterial,
    {
      materialId: params.materialId,
    }
  );

  const material = useQuery(api.materials.getMaterialWithImageById, {
    materialId: params.materialId,
  });

  const materialVersions = useQuery(
    api.material_versions.getMaterialVersionsByMaterialId,
    {
      materialId: params.materialId,
    }
  );

  const addOrUpdateAdditionalAttribute = useMutation(
    api.materials.addOrUpdateAdditionalAttribute
  );

  if (!material || !transactions) {
    return <MaterialPageSkeleton />;
  }

  const handleEditAttributes = async (updatedAttributes: {
    [key: string]: string | number;
  }) => {
    await addOrUpdateAdditionalAttribute({
      materialId: params.materialId,
      attributeName: "additionalAttributes",
      attributeValue: updatedAttributes,
    });
    setIsEditModalOpen(false);
  };

  const handleAddAttribute = async (
    name: string,
    type: "Text" | "Number",
    value: string | number
  ) => {
    await addOrUpdateAdditionalAttribute({
      materialId: params.materialId,
      attributeName: name,
      attributeValue: value,
    });
    setIsAddModalOpen(false);
  };

  const getBadgeVariant = (actionType: string | undefined) => {
    switch (actionType?.toLowerCase()) {
      case "added":
        return "added";
      case "transfer":
        return "transfer";
      case "removed":
        return "removed";
      default:
        return "outline";
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType.toLowerCase()) {
      case "added":
        return <PlusCircleIcon className="h-4 w-4 text-green-500" />;
      case "removed":
        return <MinusCircleIcon className="h-4 w-4 text-red-500" />;
      case "transfer":
        return <MoveIcon className="h-4 w-4 text-blue-500" />;
      default:
        return <MoveIcon className="h-4 w-4" />;
    }
  };

  return (
    <main className="container mx-auto p-4 space-y-4">
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
                <h2 className="text-2xl font-bold tracking-tight">
                  {material.name}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  ID: {material._id}
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                Material Details
              </Badge>
            </div>
          </CardContent>
        </div>
      </Card>

      <AdditionalAttributesCard
        additionalAttributes={material.additionalAttributes || {}}
        onAddClick={() => setIsAddModalOpen(true)}
      />

      <AddAttributeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddAttribute={handleAddAttribute}
      />

      <EditAttributesModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        attributes={material.additionalAttributes || {}}
        onSave={handleEditAttributes}
      />

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            {transactions?.length || 0} transactions found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!transactions ? (
            <TransactionsSkeleton />
          ) : transactions.length > 0 ? (
            <ScrollArea className="h-[30vh]">
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <Card
                    key={transaction.transaction_id}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center p-4">
                      <Badge
                        variant={getBadgeVariant(transaction.action_type!)}
                        className="mr-4"
                      >
                        {transaction.action_type?.toLowerCase() === "added"
                          ? "Added"
                          : transaction.action_type?.toLowerCase() === "removed"
                            ? "Removed"
                            : transaction.action_type?.toLowerCase() ===
                                "transfered"
                              ? "Transfer"
                              : "No Action Type"}
                      </Badge>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center space-x-2 flex-grow">
                              <span className="truncate hover:text-clip ">
                                {transaction.from_location_name}
                              </span>
                              <ArrowRightIcon className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate hover:text-clip">
                                {transaction.to_location_name}
                              </span>
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
                        <span className="font-semibold">
                          {transaction.quantity}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-center text-muted-foreground">
              No transactions found
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Names</CardTitle>
          <CardDescription>
            {materialVersions?.length || 0} versions found
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
                        <p className="font-semibold">
                          {version.versionNumber} {"| "}
                          {version.name || "No Name"}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {milisecondsToDate(version._creationTime)}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-center text-muted-foreground">
              No versions found
            </p>
          )}
        </CardContent>
      </Card>

      {material.qrCode && (
        <Card>
          <CardHeader>
            <CardTitle>QR Code</CardTitle>
          </CardHeader>
          <CardContent>
            <MaterialQRCode value={material.qrCode} />
          </CardContent>
        </Card>
      )}
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
