"use client";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  description: string;
  image: string;
};

const categories = ["Electrónica", "Hogar", "Deportes", "Moda"];

type FormMode = "create" | "edit";

const AdminProductsPage = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [mode, setMode] = useState<FormMode>("create");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState<Omit<Product, "id">>({
    name: "",
    price: 0,
    category: categories[0],
    stock: 0,
    description: "",
    image: "",
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Error al cargar los productos");
      const data = await response.json();
      setAllProducts(
        data.map((product: Product) => ({
          ...product,
          price: Number(product.price),
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      price: 0,
      category: categories[0],
      stock: 0,
      description: "",
      image: "",
    });
    setMode("create");
    setSelectedId(null);
    setError("");
  };

  const handleEditClick = (product: Product) => {
    setMode("edit");
    setSelectedId(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      description: product.description,
      image: product.image,
    });
    setError("");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setAllProducts((prev) => prev.filter((p) => p.id !== id));
    if (selectedId === id) {
      resetForm();
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "El nombre es obligatorio";
    if (formData.price <= 0) return "El precio debe ser mayor a 0";
    if (formData.stock < 0) return "El stock no puede ser negativo";
    if (!formData.description.trim()) return "La descripción es obligatoria";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setLoading(() => true);
      const validationError = validateForm();
      if (validationError) {
        setError(validationError);
        return;
      }
      setError("");

      if (mode === "create") {
        const newProduct: Omit<Product, "id"> = {
          ...formData,
        };
        await fetch("/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProduct),
        });
        resetForm();
        await fetchProducts();
      } else if (mode === "edit" && selectedId !== null) {
        await fetch(`/api/products/${selectedId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        resetForm();
        await fetchProducts();
        resetForm();
      }
    } catch {}

    setLoading(() => false);
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
              disabled={loading}
            >
              Nuevo producto
            </button>
          </div>
        </header>

        {/* Layout principal: Form + Tabla */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <section className="lg:col-span-1">
            <div className="bg-bg-secondary dark:bg-dark-bg-secondary rounded-lg shadow-xl p-6">
              <h2 className="text-xl font-bold mb-4">
                {mode === "create" ? "Agregar producto" : "Editar producto"}
              </h2>

              {error && (
                <p className="mb-4 text-red-500 text-sm font-semibold">
                  {error}
                </p>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <label htmlFor="name">Nombre</label>
                  <input
                    id="name"
                    type="text"
                    className="input"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="price">Precio (en pesos, ej: 199.99)</label>
                  <input
                    id="price"
                    type="number"
                    className="input"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: Number(e.target.value),
                      }))
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="category">Categoría</label>
                  <select
                    id="category"
                    className="input"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="stock">Stock</label>
                  <input
                    id="stock"
                    type="number"
                    className="input"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        stock: Number(e.target.value),
                      }))
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="description">Descripción</label>
                  <textarea
                    id="description"
                    className="input min-h-[80px]"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="name">Imagen - URL</label>
                  <input
                    id="image"
                    type="text"
                    className="input"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        image: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    type="submit"
                    className={`button flex-1 py-2 rounded-lg text-white transition duration-200 ${
                      mode === "create"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-emerald-600 hover:bg-emerald-700"
                    }`}
                    disabled={loading}
                  >
                    {mode === "create" ? "Agregar" : "Guardar cambios"}
                  </button>
                  {mode === "edit" && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="button flex-1 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white transition duration-200"
                      disabled={loading}
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
                            {product.price.toLocaleString("es-ar", {
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
                                disabled={loading}
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="button px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs"
                                disabled={loading}
                              >
                                Eliminar
                              </button>
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

export default AdminProductsPage;
