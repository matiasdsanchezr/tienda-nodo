import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createProduct } from "@/lib/services/product";
import { ProductPostSchema } from "@/lib/validations/product";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import z from "zod/v4";

export async function GET() {
  const allProducts = await prisma.product.findMany();
  return NextResponse.json(allProducts, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ status: 401 });
    }

    const body = await request.json();
    const validation = ProductPostSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { errors: z.treeifyError(validation.error) },
        {
          status: 400,
        }
      );
    }

    const product = await createProduct({
      ...validation.data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { message: "Producto registrado", product },
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
