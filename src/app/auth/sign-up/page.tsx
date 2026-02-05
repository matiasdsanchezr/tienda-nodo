"use client";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type FormData = {
  email: string;
  name: string;
  password: string;
  repassword: string;
};

const SignUpPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const result = await authClient.signUp.email(data);
    if (result.error) {
      setError(result.error.message ?? "Error desconocido");
      setLoading(false);
    } else {
      redirect("/auth/sign-in");
    }
  };

  return (
    <>
      <main className="flex-1 flex flex-col bg-bg-primary dark:bg-dark-bg-primary">
        <section className="container m-auto flex-1 flex flex-col justify-center p-1">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="m-auto flex flex-col gap-3 w-full max-w-lg bg-bg-secondary dark:bg-dark-bg-secondary p-3 md:p-8 rounded-lg shadow-xl"
          >
            <h2 className="text-2xl font-bold text-center mb-4">Registro</h2>{" "}
            {error && (
              <p className="text-red-400 text-center font-semibold">{error}</p>
            )}
            <fieldset className="grid gap-2">
              <label htmlFor="email">Correo electrónico</label>{" "}
              <input
                type="text"
                id="email"
                className={`input ${
                  errors.email ? "border-red-500 focus:border-red-500" : ""
                }`}
                {...register("email", {
                  required: "El correo electrónico es requerido",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "Formato de correo no válido",
                  },
                })}
              />
              {/* Display error message */}
              {errors.email && (
                <span className="text-red-400 text-sm">
                  {errors.email.message}
                </span>
              )}
            </fieldset>
            <fieldset className="grid gap-2">
              <label htmlFor="username">Nombre Completo</label>
              <input
                type="text"
                id="username"
                className={`input ${
                  errors.name ? "border-red-500 focus:border-red-500" : ""
                }`}
                {...register("name", {
                  required: "Se requiere un nombre valido",
                  minLength: {
                    value: 2,
                    message: "El nombre debe tener al menos 2 caracteres",
                  },
                  maxLength: {
                    value: 20,
                    message: "El nombre no debe exceder los 20 caracteres",
                  },
                })}
              />
              {errors.name && (
                <span className="text-red-400 text-sm">
                  {errors.name.message}
                </span>
              )}
            </fieldset>
            <fieldset className="grid gap-2">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                className={`input ${
                  errors.password ? "border-red-500 focus:border-red-500" : ""
                }`}
                {...register("password", {
                  required: "La contraseña es requerida",
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres",
                  },
                  validate: (value) =>
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&_-]).{8,}$/.test(
                      value
                    ) ||
                    "La contraseña no es segura. Debe contener un minimo de 8 caracteres con una minuscula, una mayuscula y un caracterer especial.",
                })}
              />
              {errors.password && (
                <span className="text-red-400 text-sm">
                  {errors.password.message}
                </span>
              )}
            </fieldset>
            <fieldset className="grid gap-2">
              <label htmlFor="repassword">Repetir contraseña</label>{" "}
              <input
                type="password"
                id="repassword"
                className={`input ${
                  errors.repassword ? "border-red-500 focus:border-red-500" : ""
                }`}
                {...register("repassword", {
                  required: "Por favor, repite la contraseña",
                  validate: (value) =>
                    value === getValues("password") ||
                    "Las contraseñas no coinciden",
                })}
              />
              {errors.repassword && (
                <span className="text-red-400 text-sm">
                  {errors.repassword.message}
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
              {loading ? "Registrando..." : "Registrarse"}
            </button>
          </form>
        </section>
      </main>
    </>
  );
};

export default SignUpPage;
