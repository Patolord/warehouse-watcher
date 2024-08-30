"use client";

import { api } from "../../../../../../convex/_generated/api";
import { Doc, Id } from "../../../../../../convex/_generated/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import imageCompression from "browser-image-compression";
import { useMutation } from "convex/react";
import { ImagePlusIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  file: z
    .custom<FileList>((val) => val instanceof FileList, "Obrigatorio")
    .refine((files) => files.length === 1, "apenas um arquivo")
    .refine(
      (files) => files[0]?.type.startsWith("image/"),
      "Insira uma image png ou jpg"
    ),
});

export function UploadModal({ materialId }: { materialId: Id<"materials"> }) {
  const generateUploadUrl = useMutation(api.materials.generateUploadUrl);
  const uploadFile = useMutation(api.materials.addImageToMaterial);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: undefined,
    },
  });

  const fileRef = form.register("file");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const file = values.file[0];

    // Compress and resize the image
    const options = {
      maxSizeMB: 1, // Target file size in MB
      maxWidthOrHeight: 1024, // Max width or height
      useWebWorker: true, // Use web worker for faster processing
    };

    try {
      const compressedFile = await imageCompression(file, options);

      const postUrl = await generateUploadUrl();

      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": compressedFile.type },
        body: compressedFile,
      });
      const { storageId } = await result.json();

      await uploadFile({
        imageFileId: storageId,
        materialId: materialId,
      });
      form.reset();

      setIsFileDialogOpen(false);
    } catch (err) {
      console.log(err);
    }
  }

  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);

  return (
    <Dialog
      open={isFileDialogOpen}
      onOpenChange={(isOpen) => {
        setIsFileDialogOpen(isOpen);
        form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button size="xs" variant="ghost">
          <ImagePlusIcon size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="file"
                render={() => (
                  <FormItem>
                    <FormLabel>Adicionar Imagem</FormLabel>
                    <FormControl>
                      <Input type="file" {...fileRef} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="flex gap-1"
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Salvar
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
