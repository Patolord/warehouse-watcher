'use client'

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SignInFormPasswordAndResetViaCode } from './SignInFormPasswordAndResetViaCode';
import { Separator } from '@/components/ui/separator';
import { SignInWithGitHub } from './SignInWithGithub';

export function SignInDialog({ className }: { className?: string }) {
    const [isOpen, setIsOpen] = useState(false);

    const handlePasswordReset = () => {
        // Implement password reset logic here
        console.log("Password reset requested");
    };

    const handleSent = (email: string) => {
        // Handle successful sign-in/sign-up
        console.log(`Signed in/up with email: ${email}`);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className={className}>Sign In</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                </DialogHeader>
                <SignInFormPasswordAndResetViaCode />
                <Separator />
                <SignInWithGitHub />
            </DialogContent>
        </Dialog>
    );
}