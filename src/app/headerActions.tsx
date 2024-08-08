"use client";

import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { SignInWithPassword } from "./(auth)/SignIn";

export function HeaderActions() {
  return (
    <>
      <Unauthenticated>
        <SignInWithPassword />
      </Unauthenticated>

      <Authenticated>Bom dia!</Authenticated>

      <AuthLoading>Loading...</AuthLoading>
    </>
  );
}
