"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";

type FormData = {
  name: string;
};

const ProfileEditPage = () => {
  // Estados de carga y error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // form hook
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");

    try {
      await fetch("/api/auth/update-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      setLoading(false);
    } catch {
      setError("Error inesperado al actualizar el perfil");
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col bg-bg-primary dark:bg-dark-bg-primary">
      <section className="container m-auto flex-1 flex flex-col justify-center p-1">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="m-auto flex flex-col gap-3 w-full max-w-lg bg-bg-secondary dark:bg-dark-bg-secondary p-3 md:p-8 rounded-lg shadow-xl"
        >
          <h2 className="text-2xl font-bold text-center mb-4">Editar Perfil</h2>

          {error && (
            <p className="text-red-400 text-center font-semibold">{error}</p>
          )}

          <fieldset className="grid gap-2">
            <label htmlFor="name">Nombre Completo</label>
            <input
              type="text"
              id="name"
              placeholder="Nombre"
              className={`input ${
                errors.name ? "border-red-500 focus:border-red-500" : ""
              }`}
              {...register("name", {
                required: "Se requiere un nombre",
                minLength: {
                  value: 2,
                  message: "El nombre debe tener al menos 2 caracteres",
                },
                maxLength: {
                  value: 40,
                  message: "El nombre no debe exceder los 40 caracteres",
                },
              })}
            />
            {errors.name && (
              <span className="text-red-400 text-sm">
                {errors.name.message}
              </span>
            )}
          </fieldset>

          <button
            type="submit"
            className={`button mx-auto w-full max-w-xs py-2 px-4 rounded transition duration-200 ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default ProfileEditPage;
