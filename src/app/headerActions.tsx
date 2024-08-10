"use client";

import { SignInFormPassword } from "@/auth/SignInFormPassword";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";


export function HeaderActions() {
  return (
    <>
      <Unauthenticated>
        <SignInFormPassword />
      </Unauthenticated>

      <Authenticated>Bom dia!</Authenticated>

      <AuthLoading>Loading...</AuthLoading>
    </>
  );
}
