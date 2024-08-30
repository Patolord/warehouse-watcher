import React, { useState } from 'react';
import { ResetPasswordWithEmailCode } from "@/auth/ResetPasswordWithEmailCode";
import { SignInWithPassword } from "@/auth/SignInWithPassword";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";

/**
 * Users choose between OAuth providers or email and password combo.
 * If they forgot their password, they can reset it via OTP code
 * sent to their email.
 */
export function SignInFormPasswordAndResetViaCode() {
    const [step, setStep] = useState<"signIn" | "forgot">("signIn");
    const { toast } = useToast();
    const provider = "password-with-reset";

    const handleSignInSuccess = (email: string) => {
        toast({
            title: "Sign in successful",
            description: `Signed in as ${email}`,
        });
        // Additional logic after successful sign in
    };

    return (
        <div className="max-w-[384px] mx-auto flex flex-col gap-4">
            {step === "signIn" ? (
                <>
                    <h2 className="font-semibold text-2xl tracking-tight">
                        Sign in or create an account
                    </h2>
                    <SignInWithPassword
                        onPasswordReset={() => setStep("forgot")}
                        onSuccess={handleSignInSuccess}
                    />
                </>
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