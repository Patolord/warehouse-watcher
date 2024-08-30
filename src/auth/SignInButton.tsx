import React from 'react';
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import { SignInDialog } from './SignInDialog';

interface SignInButtonProps {
    className?: string;
}

export function SignInButton({ className }: SignInButtonProps) {
    const t = useTranslations('Auth');

    return (
        <SignInDialog
            trigger={
                <Button className={className}>
                    {t('signIn')}
                </Button>
            }
        />
    );
}