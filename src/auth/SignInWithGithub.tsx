import React, { useState } from 'react';
import { useAuthActions } from "@convex-dev/auth/react";
import { GitHubLogo } from "@/components/GitHubLogo";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function SignInWithGitHub() {
    const { signIn } = useAuthActions();
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    const handleSignIn = async () => {
        setIsAuthenticating(true);
        try {
            await signIn("github");
        } catch (error) {
            console.error("GitHub authentication failed:", error);
        } finally {
            setIsAuthenticating(false);
        }
    };

    return (
        <Button
            className="flex-1"
            variant="outline"
            type="button"
            onClick={handleSignIn}
            disabled={isAuthenticating}
        >
            {isAuthenticating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <GitHubLogo className="mr-2 h-4 w-4" />
            )}
            {isAuthenticating ? "Authenticating..." : "GitHub"}
        </Button>
    );
}