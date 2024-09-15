import React, { useState } from "react";
import { ResetPasswordWithEmailCode } from "@/auth/ResetPasswordWithEmailCode";
import { SignInWithPassword } from "@/auth/SignInWithPassword";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";

interface SignInFormPasswordAndResetViaCodeProps {
  onClose: () => void;
}

/**
 * Users can sign in with email/password or reset their password via an email code.
 */
export function SignInFormPasswordAndResetViaCode({
  onClose,
}: SignInFormPasswordAndResetViaCodeProps) {
  const [step, setStep] = useState<"signIn" | "forgot">("signIn");
  const { toast } = useToast();
  const provider = "password-with-reset";

  const handleSignInSuccess = (email: string) => {
    toast({
      title: "Sign in successful",
      description: `Signed in as ${email}`,
    });
    onClose();
  };

  return (
    <div>
      {step === "signIn" ? (
        <SignInWithPassword
          onPasswordReset={() => setStep("forgot")}
          onSuccess={handleSignInSuccess}
        />
      ) : (
        <ResetPasswordWithEmailCode
          handleCancel={() => setStep("signIn")}
          provider={provider}
        />
      )}
      <Toaster />
    </div>
  );
}
