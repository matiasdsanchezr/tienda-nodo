import { Prisma } from "@/app/generated/prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getProduct } from "@/lib/services/product";
import { ProductPatchSchema } from "@/lib/validations/product";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import z from "zod/v4";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await getProduct(id);
    if (product) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(product, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validation = ProductPatchSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { errors: z.treeifyError(validation.error) },
        {
          status: 400,
        }
      );
    }
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        ...validation.data,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: "Producto actualizado", product },
      { status: 201 }
    );
  } catch (error) {
    console.log(JSON.stringify(error));
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ status: 401 });
    }
    const { id } = await params;
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: "Producto eliminado" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "No se encontró un producto con ese ID" },
          { status: 404 }
        );
      }
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
