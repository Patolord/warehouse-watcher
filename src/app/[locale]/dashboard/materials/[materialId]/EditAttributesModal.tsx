"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

interface EditAttributesModalProps {
  isOpen: boolean;
  onClose: () => void;
  attributes: { [key: string]: string | number };
  onSave: (attributes: { [key: string]: string | number }) => void;
}

export default function EditAttributesModal({
  isOpen,
  onClose,
  attributes,
  onSave,
}: EditAttributesModalProps) {
  const t = useTranslations("EditAttributesModal");
  const [editedAttributes, setEditedAttributes] = useState(attributes);
  const [newAttributeName, setNewAttributeName] = useState("");

  const handleAddAttribute = () => {
    if (newAttributeName) {
      setEditedAttributes({ ...editedAttributes, [newAttributeName]: "" });
      setNewAttributeName("");
    }
  };

  const handleRemoveAttribute = (name: string) => {
    const { [name]: _, ...rest } = editedAttributes;
    setEditedAttributes(rest);
  };

  const handleChangeAttribute = (name: string, value: string) => {
    setEditedAttributes({ ...editedAttributes, [name]: value });
  };

  const handleSave = () => {
    onSave(editedAttributes);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("editCustomFields")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {Object.entries(editedAttributes).map(([name, value]) => (
            <div key={name} className="flex items-center space-x-2">
              <Input value={name} readOnly className="w-1/3" />
              <Input
                value={value as string}
                onChange={(e) => handleChangeAttribute(name, e.target.value)}
                className="flex-grow"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => handleRemoveAttribute(name)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <Input
              value={newAttributeName}
              onChange={(e) => setNewAttributeName(e.target.value)}
              placeholder={t("newAttributePlaceholder")}
              className="w-1/3"
            />
            <Button onClick={handleAddAttribute}>
              <Plus className="h-4 w-4 mr-2" />
              {t("addAttribute")}
            </Button>
          </div>
          <Button onClick={handleSave} className="w-full">
            {t("save")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
