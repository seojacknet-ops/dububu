import { redirect } from 'next/navigation';
import { auth, isAdmin } from '@/lib/auth';
import { AdminSidebar } from './components/admin-sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Redirect if not authenticated
  if (!session?.user) {
    redirect('/login?callbackUrl=/admin');
  }

  // Redirect if not admin
  const adminCheck = await isAdmin();
  if (!adminCheck) {
    redirect('/?error=unauthorized');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar user={session.user} />
      <div className="lg:pl-64">
        <main className="py-8">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
