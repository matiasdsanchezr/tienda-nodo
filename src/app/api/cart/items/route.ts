// app/api/cart/items/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getOrCreateActiveCart } from "@/lib/cart";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { AddToCartSchema } from "@/lib/validations/cart";
import { addToCart } from "@/lib/services/cart";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const cart = await getOrCreateActiveCart(session.user.id);

    return NextResponse.json(
      cart.items.map((item) => ({ ...item, id: item.id.toString() }))
    );
  } catch (error) {
    console.error("Error obteniendo carrito:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Obtener usuario autenticado
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const validation = AddToCartSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Datos inválidos",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }
    const newCartItem = await addToCart({
      userId: session.user.id,
      ...validation.data,
    });

    return NextResponse.json({
      ...newCartItem,
      id: newCartItem.id.toString(),
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "PRODUCT_NOT_FOUND") {
        return NextResponse.json(
          { error: "Producto no encontrado" },
          { status: 404 }
        );
      }
      if (error.message === "INSUFFICIENT_STOCK") {
        return NextResponse.json(
          { error: "Stock insuficiente" },
          { status: 400 }
        );
      }
    }
    console.error(error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      select: { id: true, lockedAt: true },
    });

    if (!cart) {
      return NextResponse.json({ success: true });
    }

    if (cart.lockedAt) {
      return NextResponse.json(
        { error: "Cart is locked for checkout" },
        { status: 409 }
      );
    }

    const result = await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    return NextResponse.json({
      success: true,
      count: result.count,
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
