"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1 || isPending}
        className={`button px-4 py-2 rounded transition duration-200 ${
          currentPage === 1
            ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
            : "bg-bg-secondary dark:bg-dark-bg-secondary hover:bg-blue-600 hover:text-white"
        }`}
      >
        ← Anterior
      </button>

      <div className="flex gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            disabled={isPending}
            className={`button px-4 py-2 rounded transition duration-200 ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : "bg-bg-secondary dark:bg-dark-bg-secondary hover:bg-blue-600 hover:text-white"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages || isPending}
        className={`button px-4 py-2 rounded transition duration-200 ${
          currentPage === totalPages
            ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
            : "bg-bg-secondary dark:bg-dark-bg-secondary hover:bg-blue-600 hover:text-white"
        }`}
      >
        Siguiente →
      </button>
    </div>
  );
}
