"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { Loader2 } from "lucide-react";
import { useState } from "react";
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
  DialogTrigger,
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

import { api } from "../../../../../convex/_generated/api";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Name must contain at least 3 characters",
  }),
  type: z.string().min(3, {
    message: "Type must contain at least 3 characters",
  }),
});

export function CreateButton({
  triggerButton,
}: {
  triggerButton: React.ReactNode;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "",
    },
  });

  const createMaterial = useMutation(api.materials.createMaterial);
  const materialTypes = useQuery(api.materials.getUniqueMaterialTypesByUser);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formattedMaterialName = titleCase(values.name);
      const formattedType = titleCase(values.type);

      await createMaterial({
        name: formattedMaterialName,
        type: formattedType,
      });

      form.reset();
      setIsDialogOpen(false);
      toast.success("Material added successfully.");
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
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Material</DialogTitle>
          <DialogDescription>
            Type the name, type or brand of the material to be registered.
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
                      <>
                        <Input
                          placeholder="Bag, T-Shirt, Cable, etc."
                          list="material-types"
                          {...field}
                        />
                      </>
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
