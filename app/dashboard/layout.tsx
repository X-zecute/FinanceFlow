// app/(dashboard)/layout.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SidebarNav from "@/components/SidebarNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  // Protect the route
  if (!session?.user) {
    redirect("/auth?mode=login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar fixed to the left / Mobile header */}
      <SidebarNav />

      {/* Main Content Area */}
      {/* Added pt-16 or pt-20 for mobile/tablet to clear the mobile top nav, lg:pt-0 resets for desktop */}
      <main className="flex-1 overflow-y-auto lg:pl-64 pt-16 lg:pt-0">
        <div className="p-4 sm:p-8 mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}