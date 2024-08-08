"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useRouter } from "next/navigation";

export function SignInWithPassword({
  provider,
  handleSent,
  handlePasswordReset,
}: {
  provider?: string;
  handleSent?: (email: string) => void;
  handlePasswordReset?: () => void;
}) {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const { toast } = useToast();
  const router = useRouter();

  const ParamsSchema = z.object({
    email: z.string().email(),
    password: z.string().min(7, "Password must be at least 7 characters long"),
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      ParamsSchema.parse({ email, password });

      await signIn(provider ?? "password", formData);
      handleSent?.(email);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => err.message);
        toast({ title: errorMessages.join(", "), variant: "destructive" });
      } else {
        console.error(error);
        const title =
          flow === "signIn"
            ? "Could not sign in, did you mean to sign up?"
            : "Could not sign up, did you mean to sign in?";
        toast({ title, variant: "destructive" });
      }
    }

    router.push("/dashboard/warehouses");
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <Label htmlFor="email">Email</Label>
      <Input name="email" id="email" className="my-4" autoComplete="email" />
      <div className="flex items-center justify-between">
        <label htmlFor="password">Password</label>
        {handlePasswordReset && flow === "signIn" ? (
          <Button
            className="p-0 h-auto"
            type="button"
            variant="link"
            onClick={handlePasswordReset}
          >
            Forgot your password?
          </Button>
        ) : null}
      </div>
      <Input
        type="password"
        name="password"
        id="password"
        className="my-4"
        autoComplete={flow === "signIn" ? "current-password" : "new-password"}
      />
      <input name="flow" value={flow} type="hidden" />
      <Button type="submit">{flow === "signIn" ? "Sign in" : "Sign up"}</Button>
      <Button
        variant="link"
        type="button"
        onClick={() => {
          setFlow(flow === "signIn" ? "signUp" : "signIn");
        }}
      >
        {flow === "signIn"
          ? "Don't have an account? Sign up"
          : "Already have an account? Sign in"}
      </Button>
    </form>
  );
}
