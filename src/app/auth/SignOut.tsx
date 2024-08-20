import React from 'react';
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function SignOutButton() {
    const { signOut } = useAuthActions();

    const handleSignOut = async () => {
        try {
            await signOut();
            console.log("Successfully signed out");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <Button
            variant="outline"
            onClick={handleSignOut}
            className="flex items-center gap-2"
        >
            <LogOut className="h-4 w-4" />
            Sign out
        </Button>
    );
}