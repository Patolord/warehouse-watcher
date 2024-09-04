"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AdditionalAttributesCardProps {
  additionalAttributes: { [key: string]: string | number };
  onAddClick: () => void;
}

export default function AdditionalAttributesCard({
  additionalAttributes,
  onAddClick,
}: AdditionalAttributesCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Custom Fields</CardTitle>
        <Button onClick={onAddClick} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Field
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
            <p className="text-sm text-gray-500">
              No custom fields have been added yet.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
