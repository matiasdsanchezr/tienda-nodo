"use server";
import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "../prisma";

export async function getProducts() {
  const products = await prisma.product.findMany({});
  return products;
}

export const getProduct = async (
  id: Prisma.ProductFindUniqueArgs["where"]["id"]
) => {
  if (!id) throw new Error("Se necesita un id de producto");

  const product = await prisma.product.findUnique({
    where: { id },
  });
  return product;
};

export const createProduct = async (data: Prisma.ProductCreateInput) => {
  const product = await prisma.product.create({
    data,
  });
  return product;
};

export const deleteProduct = async (
  id: Prisma.ProductFindUniqueArgs["where"]["id"]
) => {
  const product = await prisma.product.delete({
    where: { id },
  });
  return product;
};

export const patchProduct = async (
  id: Prisma.ProductFindUniqueArgs["where"]["id"],
  data: Prisma.ProductUpdateInput
) => {
  const product = await prisma.product.update({
    where: { id },
    data,
  });
  return product;
};
