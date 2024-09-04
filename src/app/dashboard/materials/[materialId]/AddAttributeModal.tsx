"use client";

import React, { useState } from "react";
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
          <DialogTitle>Add New Field</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Field Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter field name"
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Field Type
            </label>
            <Select
              value={type}
              onValueChange={(value: "Text" | "Number") => setType(value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Text">Text</SelectItem>
                <SelectItem value="Number">Number</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Field Value
            </label>
            <Input
              type={type === "Number" ? "number" : "text"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter field value"
              className="mt-1"
            />
          </div>
          <Button type="submit">Add</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
