"use client";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

type FormData = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

const ProfileEditPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    getValues,
  } = useForm<FormData>();

  // Observar si el usuario está intentando cambiar contraseña
  const currentPassword = useWatch({
    control,
    name: "currentPassword",
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const message = await response.json();
      if (message.code === "INVALID_PASSWORD") {
        setError("Contraseña actual incorrecta");
        setSuccess("");
      } else {
        setSuccess("Se ha actualizado las configuraciones de seguridad");
      }
    } catch {
      setError("Error inesperado al actualizar el perfil");
    }
    setLoading(false);
  };

  return (
    <main className="flex-1 flex flex-col bg-bg-primary dark:bg-dark-bg-primary">
      <section className="container m-auto flex-1 flex flex-col justify-center p-1">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="m-auto flex flex-col gap-3 w-full max-w-lg bg-bg-secondary dark:bg-dark-bg-secondary p-3 md:p-8 rounded-lg shadow-xl"
        >
          <h2 className="text-2xl font-bold text-center mb-4">
            Configuraciones de seguridad
          </h2>

          {error && (
            <p className="text-red-400 text-center font-semibold">{error}</p>
          )}
          {success && (
            <p className="text-green-400 text-center font-semibold">
              {success}
            </p>
          )}

          <h3 className="text-lg font-semibold text-center">
            Cambiar Contraseña
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center -mt-2">
            Deja estos campos vacíos si no deseas cambiar tu contraseña
          </p>

          {/* Contraseña actual */}
          <fieldset className="grid gap-2">
            <label htmlFor="currentPassword">Contraseña actual</label>
            <input
              type="password"
              id="currentPassword"
              placeholder="Contraseña actual"
              className={`input ${
                errors.currentPassword
                  ? "border-red-500 focus:border-red-500"
                  : ""
              }`}
              {...register("currentPassword", {
                minLength: {
                  value: 6,
                  message: "La contraseña debe tener al menos 6 caracteres",
                },
              })}
            />
            {errors.currentPassword && (
              <span className="text-red-400 text-sm">
                {errors.currentPassword.message}
              </span>
            )}
          </fieldset>

          {/* Nueva contraseña */}
          <fieldset className="grid gap-2">
            <label htmlFor="newPassword">Nueva contraseña</label>
            <input
              type="password"
              id="newPassword"
              placeholder="Nueva contraseña"
              className={`input ${
                errors.newPassword ? "border-red-500 focus:border-red-500" : ""
              }`}
              {...register("newPassword", {
                required: currentPassword
                  ? "La nueva contraseña es requerida"
                  : false,
                minLength: {
                  value: 6,
                  message: "La contraseña debe tener al menos 6 caracteres",
                },
                validate: (value) => {
                  if (!currentPassword) return true;
                  return (
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&_-]).{8,}$/.test(
                      value || ""
                    ) ||
                    "La contraseña no es segura. Debe contener un mínimo de 8 caracteres con una minúscula, una mayúscula, un número y un carácter especial."
                  );
                },
              })}
            />
            {errors.newPassword && (
              <span className="text-red-400 text-sm">
                {errors.newPassword.message}
              </span>
            )}
          </fieldset>

          {/* Confirmar nueva contraseña */}
          <fieldset className="grid gap-2">
            <label htmlFor="confirmPassword">Confirmar nueva contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirmar nueva contraseña"
              className={`input ${
                errors.confirmPassword
                  ? "border-red-500 focus:border-red-500"
                  : ""
              }`}
              {...register("confirmPassword", {
                required: currentPassword
                  ? "Por favor, confirma la nueva contraseña"
                  : false,
                validate: (value) => {
                  if (!currentPassword) return true;
                  return (
                    value === getValues("newPassword") ||
                    "Las contraseñas no coinciden"
                  );
                },
              })}
            />
            {errors.confirmPassword && (
              <span className="text-red-400 text-sm">
                {errors.confirmPassword.message}
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
