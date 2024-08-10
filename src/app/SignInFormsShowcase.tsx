
import { SignInFormPassword } from "@/auth/SignInFormPassword";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// This component is here to showcase different combinations of sign-in methods.
// 1. Choose one of the forms and use it directly instead of this component.
// 2. Delete or add OAuth providers as needed.
// 3. Delete the unused forms.
export function SignInFormsShowcase() {
    return (

        <SignInFormPassword />

    );
}