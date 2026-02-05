import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: string[];
};

export const ProtectedRoute = async ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {
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
