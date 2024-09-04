import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { titleCase } from "@/lib/utils";
import { api } from "../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../convex/_generated/dataModel";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Name must contain at least 3 characters",
  }),
  type: z.string().min(3, {
    message: "Type must contain at least 3 characters",
  }),
});

interface NewMaterialDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newMaterial: {
    materialId: Id<"materials">;
    versionId: Id<"materialVersions">;
    name: string;
  }) => void;
}

export function NewMaterialDialog({
  isOpen,
  onClose,
  onCreated,
}: NewMaterialDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "",
    },
  });

  const createMaterial = useMutation(api.materials.createMaterial);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formattedMaterialName = titleCase(values.name);
      const formattedType = titleCase(values.type);

      const newMaterial = await createMaterial({
        name: formattedMaterialName,
        type: formattedType,
      });

      form.reset();
      onClose();
      toast.success("Material added successfully.");
      onCreated({ ...newMaterial, name: formattedMaterialName });
    } catch (error) {
      if (error instanceof ConvexError) {
        if (error.data === "Material already exists") {
          toast.error("Error adding material, material already exists");
        } else if (error.data === "User not authenticated") {
          toast.error("Authentication error, please log in again");
        }
      } else {
        console.error("Unexpected Error:" + error);
        toast.error("Unexpected error.");
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Material</DialogTitle>
          <DialogDescription>
            Enter the name, type, or brand of the material to be added.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Copper, Grid, Cable, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="flex gap-1"
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
