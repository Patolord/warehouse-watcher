import React, { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  flow: z.enum(["signIn", "signUp"]),
});

interface SignInWithPasswordProps {
  onPasswordReset: () => void;
  onSuccess: (email: string) => void;
}

export function SignInWithPassword({
  onPasswordReset,
  onSuccess,
}: SignInWithPasswordProps) {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setErrors([]);
    setAuthError(null);

    const formData = new FormData(event.currentTarget);
    const formValues = Object.fromEntries(formData.entries());

    try {
      formSchema.parse(formValues);
      await signIn("password-with-reset", formData);
      onSuccess(formValues.email as string);
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.errors);
      } else if (error instanceof Error) {
        setAuthError("Invalid account or password");
      } else {
        setAuthError(
          "An unexpected error occurred. Please try again or contact support."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <Input name="email" id="email" className="my-4" autoComplete="email" />
      {errors.find((e) => e.path[0] === "email") && (
        <p className="text-red-500">
          {errors.find((e) => e.path[0] === "email")?.message}
        </p>
      )}

      <div className="flex items-center justify-between">
        <label htmlFor="password">Password</label>
        {flow === "signIn" && (
          <Button
            className="p-0 h-auto"
            type="button"
            variant="link"
            onClick={onPasswordReset}
          >
            Forgot password?
          </Button>
        )}
      </div>
      <Input
        type="password"
        name="password"
        id="password"
        className="my-4"
        autoComplete={flow === "signIn" ? "current-password" : "new-password"}
      />
      {errors.find((e) => e.path[0] === "password") && (
        <p className="text-red-500">
          {errors.find((e) => e.path[0] === "password")?.message}
        </p>
      )}

      {authError && <p className="text-red-500 mb-4">{authError}</p>}

      <input name="flow" value={flow} type="hidden" />
      <Button type="submit" disabled={submitting}>
        {flow === "signIn" ? "Sign In" : "Sign Up"}
      </Button>
      <Button
        variant="link"
        type="button"
        onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
      >
        {flow === "signIn"
          ? "New user? Create an account!"
          : "Already have an account? Sign in"}
      </Button>
    </form>
  );
}
