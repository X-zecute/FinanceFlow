// app/(dashboard)/dashboard/page.tsx
import { auth } from "@/auth";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="w-full space-y-8 pb-8">
      <DashboardClient user={session?.user} />
    </div>
  );
}