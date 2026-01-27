import { redirect } from "next/navigation";

// With Clerk authentication, we redirect to the Clerk sign-up page
export default function RegisterPage() {
  redirect("/sign-up");
}
