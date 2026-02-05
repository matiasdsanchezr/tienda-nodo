import { RoleGate } from "@/components/ui/role-gate";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleGate allowedRoles={["admin"]}>{children}</RoleGate>;
}
