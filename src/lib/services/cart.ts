import { headers } from "next/headers";
import { auth } from "../auth";
import { getOrCreateActiveCart } from "../cart";
import { prisma } from "../prisma";

interface AddToCartParams {
  userId: string;
  productId: number;
  quantity: number;
}

export async function addToCart({
  userId,
  productId,
  quantity,
}: AddToCartParams) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  if (product.stock < quantity) {
    throw new Error("INSUFFICIENT_STOCK");
  }

  const cart = await getOrCreateActiveCart(userId);

  const cartItem = await prisma.cartItem.upsert({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
    update: {
      quantity: { increment: quantity },
    },
    create: {
      cartId: cart.id,
      productId,
      quantity,
      unitPrice: product.price,
    },
    include: {
      product: true,
    },
  });

  return cartItem;
}

export const getCartItems = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !session.user) {
    throw new Error("No autenticado");
  }

  const cart = await getOrCreateActiveCart(session.user.id);
  return cart.items.map((item) => ({ ...item, id: item.id.toString() }));
};
