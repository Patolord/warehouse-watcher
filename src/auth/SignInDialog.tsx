import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SignInWithPassword } from './SignInWithPassword';
import { Separator } from '@/components/ui/separator';
import { SignInWithGitHub } from './SignInWithGithub';

interface SignInDialogProps {
    trigger: React.ReactNode;
}

export function SignInDialog({ trigger }: SignInDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations('Auth');

    const handlePasswordReset = () => {
        // Implement password reset logic here
        console.log("Password reset requested");
    };

    const handleSuccess = (email: string) => {
        console.log(`Signed in/up with email: ${email}`);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('signInTitle')}</DialogTitle>
                </DialogHeader>
                <SignInWithPassword onPasswordReset={handlePasswordReset} onSuccess={handleSuccess} />
                <Separator />
                <SignInWithGitHub />
            </DialogContent>
        </Dialog>
    );
}