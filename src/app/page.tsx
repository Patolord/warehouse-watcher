"use client";

import { SignInWithPassword } from "./(auth)/SignIn";

import {
  Authenticated,
  AuthLoading,
  Unauthenticated,
  useQuery,
} from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignOut } from "./(auth)/SignOut";

export default function App() {
  const user = useQuery(api.users.viewer);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-4">
        <Authenticated>
          <Card>
            <CardContent className="text-center py-6">
              <p className="mb-4">Welcome, {user?.email}</p>
              <SignOut />
            </CardContent>
          </Card>
        </Authenticated>
        <AuthLoading>
          <Card>
            <CardContent className="text-center py-6">
              <p>Loading...</p>
            </CardContent>
          </Card>
        </AuthLoading>
        <Unauthenticated>
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Sign In</CardTitle>
            </CardHeader>
            <CardContent>
              <SignInWithPassword />
            </CardContent>
          </Card>
        </Unauthenticated>
      </div>
    </div>
  );
}
