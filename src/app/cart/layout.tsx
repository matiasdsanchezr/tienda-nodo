import { ProtectedRoute } from "@/components/ui/protected-route";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tienda NODO - Carrito de compras",
  description: "NODO Tecnologico 2026",
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
