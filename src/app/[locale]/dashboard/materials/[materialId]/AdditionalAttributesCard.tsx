"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";

interface AdditionalAttributesCardProps {
  additionalAttributes: { [key: string]: string | number };
  onAddClick: () => void;
}

export default function AdditionalAttributesCard({
  additionalAttributes,
  onAddClick,
}: AdditionalAttributesCardProps) {
  const t = useTranslations("AdditionalAttributesCard");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("customFields")}</CardTitle>
        <Button onClick={onAddClick} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          {t("addField")}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Object.entries(additionalAttributes).map(([name, value]) => (
            <div key={name} className="flex justify-between">
              <span className="font-medium">{name}:</span>
              <span>{value.toString()}</span>
            </div>
          ))}
          {Object.keys(additionalAttributes).length === 0 && (
            <p className="text-sm text-gray-500">{t("noCustomFields")}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
