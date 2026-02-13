"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

type SortOption =
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc"
  | "rating";

interface ProductFiltersProps {
  categories: string[];
  selectedCategory: string;
  searchTerm: string;
  sortBy: SortOption;
  totalResults: number;
}

export default function ProductFilters({
  categories,
  selectedCategory: initialCategory,
  searchTerm: initialSearchTerm,
  sortBy: initialSortBy,
  totalResults,
}: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState(initialSortBy);

  const updateUrl = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "" && value !== "Todas") {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    if (name !== "page") params.delete("page");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="bg-bg-secondary dark:bg-dark-bg-secondary rounded-lg shadow-lg p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Input de Búsqueda */}
        <div className="md:col-span-3">
          <input
            type="text"
            placeholder="Buscar productos..."
            className="input w-full"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              updateUrl("search", e.target.value);
            }}
          />
        </div>

        {/* Filtro por categoría */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-sm">Categoría</label>
          <select
            className="input"
            value={selectedCategory}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedCategory(val);
              updateUrl("category", val);
            }}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Ordenamiento */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-sm">Ordenar por</label>
          <select
            className="input"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as SortOption);
              updateUrl("sort", e.target.value);
            }}
          >
            <option value="name-asc">Nombre (A-Z)</option>
            <option value="name-desc">Nombre (Z-A)</option>
            <option value="price-asc">Precio (Menor a Mayor)</option>
            <option value="price-desc">Precio (Mayor a Menor)</option>
            <option value="rating">Mejor Valorados</option>
          </select>
        </div>

        {/* Resultados */}
        <div className="flex items-end">
          <p className="text-sm font-semibold">
            {totalResults} producto{totalResults !== 1 ? "s" : ""} encontrado
            {totalResults !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Filtros activos */}
      {(selectedCategory !== "Todas" || searchTerm) && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm font-semibold">Filtros activos:</span>
          {selectedCategory !== "Todas" && (
            <button
              onClick={() => {
                setSelectedCategory("Todas");
                updateUrl("category", "");
              }}
              className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-700 transition duration-200"
            >
              {selectedCategory} ✕
            </button>
          )}
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                updateUrl("search", "");
              }}
              className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-700 transition duration-200"
            >
              &quot;{searchTerm}&quot; ✕
            </button>
          )}
        </div>
      )}
    </div>
  );
}
