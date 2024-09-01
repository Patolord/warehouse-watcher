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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddAttributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAttribute: (
    name: string,
    type: "Text" | "Number",
    value: string | number
  ) => void;
}

export default function AddAttributeModal({
  isOpen,
  onClose,
  onAddAttribute,
}: AddAttributeModalProps) {
  const t = useTranslations("AddAttributeModal");
  const [name, setName] = useState("");
  const [type, setType] = useState<"Text" | "Number">("Text");
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && value) {
      onAddAttribute(name, type, type === "Number" ? Number(value) : value);
      setName("");
      setType("Text");
      setValue("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("addNewField")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("fieldName")}
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("fieldNamePlaceholder")}
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("fieldType")}
            </label>
            <Select
              value={type}
              onValueChange={(value: "Text" | "Number") => setType(value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder={t("selectType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Text">{t("text")}</SelectItem>
                <SelectItem value="Number">{t("number")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("fieldValue")}
            </label>
            <Input
              type={type === "Number" ? "number" : "text"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t("fieldValuePlaceholder")}
              className="mt-1"
            />
          </div>
          <Button type="submit">{t("add")}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
