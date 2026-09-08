import { notFound } from "next/navigation";
import AdminDashboard from "@/components/admin-dashboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ adminPath: string }>;
}

export default async function Page({ params }: PageProps) {
  const { adminPath } = await params;
  const secretPath = process.env.ADMIN_ROUTE_PATH || "admin-secret-access";

  if (adminPath !== secretPath) {
    notFound();
  }

  return <AdminDashboard adminPath={adminPath} />;
}
