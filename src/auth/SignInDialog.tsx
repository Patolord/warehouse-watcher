import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { SignInFormPasswordAndResetViaCode } from "./SignInFormPasswordAndResetViaCode";
import { SignInWithGitHub } from "./SignInWithGithub";

interface SignInDialogProps {
  trigger: React.ReactNode;
}

export function SignInDialog({ trigger }: SignInDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign in to your account</DialogTitle>
        </DialogHeader>
        <SignInFormPasswordAndResetViaCode onClose={() => setIsOpen(false)} />
        <Separator className="my-4" />
        <SignInWithGitHub />
      </DialogContent>
    </Dialog>
  );
}
