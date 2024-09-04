import React from "react";
import { Button } from "@/components/ui/button";
import { SignInDialog } from "./SignInDialog";

interface SignInButtonProps {
  className?: string;
}

export function SignInButton({ className }: SignInButtonProps) {
  return (
    <SignInDialog trigger={<Button className={className}>Sign In</Button>} />
  );
}
