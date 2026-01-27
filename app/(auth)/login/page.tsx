import { redirect } from "next/navigation";

// Force dynamic to avoid build-time issues
export const dynamic = 'force-dynamic';

// With Clerk authentication, we redirect to the Clerk sign-in page
export default function LoginPage() {
  redirect("/sign-in");
}
