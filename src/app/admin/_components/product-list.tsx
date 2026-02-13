"use client";
import { Product } from "@/app/generated/prisma/client";
import {
  createProductAction,
  deleteProductAction,
  editProductAction,
} from "@/lib/actions/product";
import {
  ProductPostSchema,
  ProductPostSchemaType,
} from "@/lib/validations/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useState } from "react";
import { useForm } from "react-hook-form";

const categories = ["Electrónica", "Hogar", "Deportes", "Moda"];

type FormMode = "create" | "edit";

export const ProductList = ({ allProducts }: { allProducts: Product[] }) => {
  const [mode, setMode] = useState<FormMode>("create");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [, deleteFormAction, isPendingDelete] = useActionState(
    deleteProductAction,
    null
  );
  const [, patchFormAction, isPendingPatch] = useActionState(
    editProductAction,
    null
  );
  const [, createFormAction, isPendingCreate] = useActionState(
    createProductAction,
    null
  );

  const isPendingAction = isPendingCreate || isPendingDelete || isPendingPatch;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductPostSchemaType>({
    resolver: zodResolver(ProductPostSchema),
    defaultValues: {
      name: "",
      price: 0,
      category: categories[0],
      stock: 0,
      description: "",
      image: "",
    },
  });

  const resetForm = () => {
    reset({
      name: "",
      price: 0,
      category: categories[0],
      stock: 0,
      description: "",
      image: "",
    });
    setMode("create");
    setSelectedId(null);
  };

  const handleEditClick = (product: Product) => {
    setMode("edit");
    setSelectedId(product.id);
    reset({
      name: product.name,
      price: product.price / 100,
      category: product.category,
      stock: product.stock,
      description: product.description,
      image: product.image,
    });
  };

  const onSubmit = async (data: ProductPostSchemaType) => {
    try {
      const formData = new FormData();
      
      formData.append("name", data.name);
      formData.append("price", data.price.toString());
      formData.append("category", data.category);
      formData.append("stock", data.stock.toString());
      formData.append("description", data.description);
      formData.append("image", data.image);

      if (mode === "create") {
        startTransition(() => createFormAction(formData));
        resetForm();
      } else if (mode === "edit" && selectedId !== null) {
        formData.append("id", selectedId.toString());
        startTransition(() => patchFormAction(formData));
        resetForm();
      }
    } catch (err) {
      console.error(err instanceof Error ? err.message : "Error al procesar");
    }
  };

  const filteredProducts = allProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="flex-1 bg-bg-primary dark:bg-dark-bg-primary min-h-screen">
      <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Administrar Productos</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Agrega, edita o elimina productos de la tienda
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={resetForm}
              className={`button px-4 py-2 rounded-lg transition duration-200 ${
                mode === "create"
                  ? "bg-blue-600 text-white"
                  : "bg-bg-secondary dark:bg-dark-bg-secondary hover:bg-blue-600 hover:text-white"
              }`}
              disabled={isPendingAction}
            >
              Nuevo producto
            </button>
          </div>
        </header>

        {/* Layout principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <section className="lg:col-span-1">
            <div className="bg-bg-secondary dark:bg-dark-bg-secondary rounded-lg shadow-xl p-6">
              <h2 className="text-xl font-bold mb-4">
                {mode === "create" ? "Agregar producto" : "Editar producto"}
              </h2>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <div className="grid gap-2">
                  <label htmlFor="name">Nombre</label>
                  <input
                    id="name"
                    type="text"
                    className="input"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <label htmlFor="price">Precio (en pesos, ej: 199.99)</label>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    className="input"
                    {...register("price", {
                      setValueAs: (v) => Number(v) * 100,
                    })}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-xs">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <label htmlFor="category">Categoría</label>
                  <select
                    id="category"
                    className="input"
                    {...register("category")}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-xs">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <label htmlFor="stock">Stock</label>
                  <input
                    id="stock"
                    type="number"
                    className="input"
                    required
                    {...register("stock", {
                      setValueAs: (v) => Number(v),
                    })}
                  />
                  {errors.stock && (
                    <p className="text-red-500 text-xs">
                      {errors.stock.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <label htmlFor="description">Descripción</label>
                  <textarea
                    id="description"
                    className="input min-h-[80px]"
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <label htmlFor="image">Imagen - URL</label>
                  <input
                    id="image"
                    type="text"
                    className="input"
                    {...register("image")}
                  />
                  {errors.image && (
                    <p className="text-red-500 text-xs">
                      {errors.image.message}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    type="submit"
                    className={`button flex-1 py-2 rounded-lg text-white transition duration-200 ${
                      mode === "create"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-emerald-600 hover:bg-emerald-700"
                    }`}
                    disabled={isPendingAction}
                  >
                    {mode === "create" ? "Agregar" : "Guardar cambios"}
                  </button>
                  {mode === "edit" && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="button flex-1 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white transition duration-200"
                      disabled={isPendingAction}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </section>

          {/* Tabla de productos */}
          <section className="lg:col-span-2">
            <div className="bg-bg-secondary dark:bg-dark-bg-secondary rounded-lg shadow-xl p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <h2 className="text-xl font-bold">Listado de productos</h2>
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  className="input max-w-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {filteredProducts.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No hay productos para mostrar.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                        <th className="py-2 pr-4">ID</th>
                        <th className="py-2 pr-4">Nombre</th>
                        <th className="py-2 pr-4">Categoría</th>
                        <th className="py-2 pr-4">Precio</th>
                        <th className="py-2 pr-4">Stock</th>
                        <th className="py-2 pr-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr
                          key={product.id}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-bg-primary/60 dark:hover:bg-dark-bg-primary/60"
                        >
                          <td className="py-2 pr-4">{product.id}</td>
                          <td className="py-2 pr-4 font-semibold">
                            {product.name}
                          </td>
                          <td className="py-2 pr-4">{product.category}</td>
                          <td className="py-2 pr-4">
                            {(product.price / 100).toLocaleString("es-ar", {
                              style: "currency",
                              currency: "ARS",
                              minimumFractionDigits: 2,
                            })}
                          </td>
                          <td className="py-2 pr-4">{product.stock}</td>
                          <td className="py-2 pr-0">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEditClick(product)}
                                className="button px-3 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white text-xs"
                                disabled={isPendingAction}
                              >
                                Editar
                              </button>
                              <form action={deleteFormAction}>
                                <input
                                  type="hidden"
                                  name="id"
                                  value={product.id}
                                />
                                <button
                                  type="submit"
                                  className="button px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs"
                                  disabled={isPendingAction}
                                >
                                  Eliminar
                                </button>
                              </form>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};
