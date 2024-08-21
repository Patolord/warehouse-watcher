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
        message: "Nome deve conter no mínimo 3 caracteres",
    }),
    type: z.string().min(3, {
        message: "Tipo deve conter no mínimo 3 caracteres",
    }),
});

interface NewMaterialDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onCreated: (newMaterial: { materialId: Id<"materials">; versionId: Id<"materialVersions">; name: string }) => void;
}

export function NewMaterialDialog({ isOpen, onClose, onCreated }: NewMaterialDialogProps) {
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
            toast.success("Material adicionado com sucesso.");
            onCreated({ ...newMaterial, name: formattedMaterialName });
        } catch (error) {
            if (error instanceof ConvexError) {
                if (error.data === "Material já existe") {
                    toast.error("Erro ao adicionar material, material já existe");
                } else if (error.data === "User not authenticated") {
                    toast.error("Erro de autenticação, faça login novamente");
                }
            } else {
                console.error("Error Inesperado:" + error);
                toast.error("Erro inesperado.");
            }
        }
    }


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Cadastrar Novo Material</DialogTitle>
                    <DialogDescription>
                        Digite nome, tipo ou marca do material a ser cadastrado.
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
                                        <FormLabel>Nome</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nome" {...field} />
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
                                        <FormLabel>Tipo</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Cobre, Grelha, Cabo, etc."
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
                                Salvar
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}