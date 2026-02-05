import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type RoleGateProps = {
  allowedRoles: string[];
  children: React.ReactNode;
};

export const RoleGate = async ({ children, allowedRoles }: RoleGateProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  if (allowedRoles && !allowedRoles.includes(session.user.role)) {
    redirect("/");
  }

  return <>{children}</>;
};
