'use client'

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { SignInWithGitHub } from './SignInWithGithub';
import { SignInWithPassword } from './SignInWithPassword';

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
                    <DialogTitle>Sign In</DialogTitle>
                    <DialogDescription>
                        Choose your preferred method to sign in or create an account.
                    </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="password" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="password">Password</TabsTrigger>
                        <TabsTrigger value="github">GitHub</TabsTrigger>
                    </TabsList>
                    <TabsContent value="password">
                        <SignInWithPassword
                            handleSent={handleSent}
                            handlePasswordReset={handlePasswordReset}
                        />
                    </TabsContent>
                    <TabsContent value="github">
                        <SignInWithGitHub />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}