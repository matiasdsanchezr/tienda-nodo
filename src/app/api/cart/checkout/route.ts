// app/api/cart/checkout/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Usar transacción para atomicidad
    const result = await prisma.$transaction(async (tx) => {
      // Obtener carrito activo
      const cart = await tx.cart.findUnique({
        where: { userId: session.user.id },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      if (cart.lockedAt) {
        throw new Error("Carrito ya está siendo procesado");
      }

      if (cart.items.length === 0) {
        throw new Error("Carrito vacío");
      }

      // Bloquear carrito
      await tx.cart.update({
        where: { id: cart.id },
        data: { lockedAt: new Date() },
      });

      // Validar stock
      for (const item of cart.items) {
        if (item.product.stock < item.quantity) {
          throw new Error(`Stock insuficiente para ${item.product.name}`);
        }
      }

      // Crear orden
      const order = await tx.order.create({
        data: {
          userId: session.user.id,
          status: "PENDING",
          totalPrice: cart.items.reduce(
            (sum, item) => sum + Number(item.unitPrice) * item.quantity,
            0
          ),
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          },
        },
      });

      // Descontar stock
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Vaciar carrito y desbloquear
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      await tx.cart.update({
        where: { id: cart.id },
        data: { lockedAt: null },
      });

      return order;
    });

    return NextResponse.json({
      success: true,
      orderId: result.id,
    });
  } catch (error) {
    console.error("Error en checkout:", error);
    return NextResponse.json(
      // @ts-expect-error unknown error type
      { error: error.message || "Error procesando orden" },
      { status: 500 }
    );
  }
}
