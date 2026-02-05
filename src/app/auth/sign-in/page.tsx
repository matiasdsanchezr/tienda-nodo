"use client";
import { authClient } from "@/lib/auth-client";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LuLoaderCircle } from "react-icons/lu";

type FormData = {
  email: string;
  password: string;
};

export const SignInPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const result = await authClient.signIn.email(data);
    if (result.error) {
      setError(result.error.message ?? "Error desconocido");
    } else {
      redirect(`/`);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (session) {
      redirect("/");
    }
  }, [session, router]);

  if (isSessionLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg-primary dark:bg-dark-bg-primary">
        <LuLoaderCircle className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  return (
    <>
      <main className="flex-1 flex flex-col bg-bg-primary dark:bg-dark-bg-primary">
        <div className="p-3 md:p-5 flex-1 flex flex-col justify-center">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 container max-w-lg m-auto p-6 rounded-lg shadow-xl bg-bg-secondary dark:bg-dark-bg-secondary" // Increased gap, padding, added shadow
          >
            <h2 className="text-2xl font-bold text-center mb-4">
              Iniciar Sesión
            </h2>
            {/* Display login error from the auth context */}
            {error && (
              <p className="text-red-400 text-center font-semibold">
                Credenciales invalidas
              </p>
            )}
            <div className="grid gap-2">
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
              {errors.email && (
                <span className="text-red-400 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="grid gap-2">
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
                })}
              />
              {errors.password && (
                <span className="text-red-400 text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`button mx-auto w-full max-w-xs py-2 px-4 rounded transition duration-200 ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Ingresando..." : "Ingresar"}{" "}
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default SignInPage;
