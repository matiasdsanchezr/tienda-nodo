import { prisma } from "../prisma";

export const getProduct = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
  });
  return product;
};
