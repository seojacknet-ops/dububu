import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { AdminSidebar } from "./components/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  const user = await currentUser();

  // Redirect if not authenticated
  if (!userId || !user) {
    redirect("/sign-in?redirect_url=/admin");
  }

  // Check if user is admin (you can customize this based on your needs)
  // For now, we'll check user metadata or email domain
  const isAdmin =
    user.publicMetadata?.role === "admin" ||
    user.emailAddresses.some((email) =>
      email.emailAddress.endsWith("@dububu.com")
    );

  if (!isAdmin) {
    redirect("/?error=unauthorized");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar
        user={{
          name: user.firstName || user.username || "Admin",
          email: user.emailAddresses[0]?.emailAddress || "",
          image: user.imageUrl,
        }}
      />
      <div className="lg:pl-64">
        <main className="py-8">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
