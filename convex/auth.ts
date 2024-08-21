import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import GitHub from "@auth/core/providers/github";
import { ResendOTPPasswordReset } from "./ResendOTPPasswordReset";
import Resend from "@auth/core/providers/resend";
import { ResendOTP } from "./otp/ResendOTP";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    Resend({
      from: process.env.AUTH_EMAIL ?? "My App <onboarding@resend.dev>",
    }),
    ResendOTP,
    Password({
      id: "password-code",
      reset: ResendOTPPasswordReset,
      verify: ResendOTP,
    }),
    Password({ id: "password-with-reset", reset: ResendOTPPasswordReset }),
    GitHub,
  ],
});
