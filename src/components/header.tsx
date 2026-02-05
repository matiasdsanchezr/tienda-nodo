"use client";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import {
  HiOutlineMenu,
  HiOutlineX,
  HiHome,
  HiShoppingBag,
  HiMail,
  HiShieldCheck,
  HiLogin,
  HiUserAdd,
  HiLogout,
  HiCog,
  HiUser,
} from "react-icons/hi";
import { PiShoppingCartSimple, PiShoppingCart } from "react-icons/pi";
import { redirect } from "next/navigation";

type HeaderProps = {
  isFixed?: boolean;
};

const Header = ({ isFixed = false }: HeaderProps) => {
  const session = authClient.useSession().data;
  const [displayMobileMenu, setDisplayMobileMenu] = useState(false);
  const [displayUserMenu, setDisplayUserMenu] = useState(false);

  return (
    <header
      className={`bg-bg-secondary dark:bg-dark-bg-secondary shadow-md top-0 left-0 w-full z-50 ${
        isFixed ? "fixed" : "sticky"
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between">
          {/* Logo y Navegación */}
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="flex items-center cursor-pointer select-none"
              aria-label="Ir a Inicio"
            >
              <PiShoppingCartSimple className="text-blue-600 text-3xl mr-2" />
              <span className="text-xl font-bold">Tienda NODO</span>
            </Link>

            <nav className="flex space-x-6" aria-label="Navegación principal">
              <Link
                href="/"
                className="flex items-center gap-2 hover:text-blue-600 transition"
                aria-label="Inicio"
              >
                <HiHome className="text-lg" />
                Inicio
              </Link>
              <Link
                href="/products"
                className="flex items-center gap-2 hover:text-blue-600 transition"
                aria-label="Productos"
              >
                <HiShoppingBag className="text-lg" />
                Productos
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-2 hover:text-blue-600 transition"
                aria-label="Contacto"
              >
                <HiMail className="text-lg" />
                Contacto
              </Link>
              {session?.user?.role === "admin" && (
                <Link
                  href="/admin/products"
                  className="flex items-center gap-2 hover:text-blue-600 transition"
                  aria-label="Administrador"
                >
                  <HiShieldCheck className="text-lg" />
                  Menu de administrador
                </Link>
              )}
            </nav>
          </div>

          {/* Carrito y Perfil */}
          <div className="flex items-center gap-4">
            {/* Botón Carrito */}
            {session?.user && (
              <Link
                href="/cart"
                className="relative flex items-center gap-2 px-3 py-2 rounded-md hover:bg-bg-primary dark:hover:bg-dark-bg-primary transition"
                aria-label="Ver carrito"
              >
                <PiShoppingCart className="text-2xl" />
                {/* Badge opcional para cantidad de items */}
                {/* <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span> */}
              </Link>
            )}

            {session?.user ? (
              <div className="flex items-center space-x-4">
                {/* Perfil - menú desplegable de usuario */}
                <div className="relative" aria-label="Menú de usuario">
                  <button
                    type="button"
                    onClick={() => setDisplayUserMenu((s) => !s)}
                    className="flex items-center space-x-2 hover:text-blue-600 transition"
                    aria-expanded={displayUserMenu}
                    aria-haspopup="menu"
                  >
                    <FaUserCircle className="text-2xl" />
                    <span className="truncate" style={{ maxWidth: 120 }}>
                      {session.user.name}
                    </span>
                    <FiChevronDown
                      className={`transition-transform ${
                        displayUserMenu ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {displayUserMenu && (
                    <div
                      className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50 bg-bg-primary dark:bg-dark-bg-primary"
                      role="menu"
                      aria-label="Opciones de usuario"
                    >
                      <div role="none">
                        <Link
                          href="/settings/profile"
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-bg-secondary dark:hover:bg-dark-bg-secondary"
                          role="menuitem"
                          onClick={() => setDisplayUserMenu(false)}
                        >
                          <HiUser />
                          Editar perfil
                        </Link>
                        <Link
                          href="/settings/security"
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-bg-secondary dark:hover:bg-dark-bg-secondary"
                          role="menuitem"
                          onClick={() => setDisplayUserMenu(false)}
                        >
                          <HiCog />
                          Configuraciones de Seguridad
                        </Link>
                      </div>
                      <hr className="border-t border-gray-700 mx-1" />
                      <div role="none">
                        <button
                          className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm hover:bg-bg-secondary dark:hover:bg-dark-bg-secondary"
                          onClick={() => {
                            authClient.signOut();
                            redirect("/");
                          }}
                          role="menuitem"
                        >
                          <HiLogout />
                          Cerrar sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/sign-in"
                  className="flex items-center gap-2 px-4 py-1 rounded-md hover:text-blue-600 transition"
                  aria-label="Iniciar sesión"
                >
                  <HiLogin className="text-lg" />
                  Iniciar sesión
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="flex items-center gap-2 px-4 py-1 rounded-md hover:text-blue-600 transition"
                  aria-label="Registrarme"
                >
                  <HiUserAdd className="text-lg" />
                  Registrarme
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between">
          <Link href="/" className="flex items-center" aria-label="Ir a Inicio">
            <PiShoppingCartSimple className="text-blue-600 text-2xl mr-2" />
            <span className="text-lg font-bold">Tienda NODO</span>
          </Link>

          <div className="flex items-center space-x-4">
            {/* Botón carrito móvil */}
            {session?.user && (
              <Link href="/cart" aria-label="Ver carrito" className="relative">
                <PiShoppingCart className="text-2xl" />
                {/* Badge opcional */}
                {/* <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </span> */}
              </Link>
            )}

            <button
              type="button"
              aria-label="Mostrar menú móvil"
              onClick={() => setDisplayMobileMenu((s) => !s)}
            >
              {displayMobileMenu ? (
                <HiOutlineX className="text-2xl" />
              ) : (
                <HiOutlineMenu className="text-2xl" />
              )}
            </button>
          </div>
        </div>

        {/* Menú móvil extendido */}
        {displayMobileMenu && (
          <nav aria-label="Menú móvil" className="lg:hidden mt-4">
            <div className="flex flex-col space-y-2 bg-bg-primary dark:bg-dark-bg-primary rounded-md p-4 shadow-lg">
              {/* Nombre del usuario si está autenticado */}
              {session?.user && (
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-700">
                  <FaUserCircle className="text-2xl text-blue-600" />
                  <span className="font-semibold">{session.user.name}</span>
                </div>
              )}

              <Link
                href="/"
                className="flex items-center gap-2 px-2 py-2 hover:bg-bg-secondary dark:hover:bg-dark-bg-secondary rounded transition"
                onClick={() => setDisplayMobileMenu(false)}
              >
                <HiHome className="text-lg" />
                Inicio
              </Link>
              <Link
                href="/products"
                className="flex items-center gap-2 px-2 py-2 hover:bg-bg-secondary dark:hover:bg-dark-bg-secondary rounded transition"
                onClick={() => setDisplayMobileMenu(false)}
              >
                <HiShoppingBag className="text-lg" />
                Productos
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-2 px-2 py-2 hover:bg-bg-secondary dark:hover:bg-dark-bg-secondary rounded transition"
                onClick={() => setDisplayMobileMenu(false)}
              >
                <HiMail className="text-lg" />
                Contacto
              </Link>
              {session?.user?.role === "admin" && (
                <Link
                  href="/admin/products"
                  className="flex items-center gap-2 px-2 py-2 hover:bg-bg-secondary dark:hover:bg-dark-bg-secondary rounded transition"
                  onClick={() => setDisplayMobileMenu(false)}
                >
                  <HiShieldCheck className="text-lg" />
                  Menu de administrador
                </Link>
              )}

              {session?.user ? (
                <>
                  <hr className="border-t border-gray-700" />
                  <Link
                    href="/settings/profile"
                    className="flex items-center gap-2 px-2 py-2 hover:bg-bg-secondary dark:hover:bg-dark-bg-secondary rounded transition"
                    onClick={() => setDisplayMobileMenu(false)}
                  >
                    <HiUser className="text-lg" />
                    Editar perfil
                  </Link>
                  <Link
                    href="/settings/security"
                    className="flex items-center gap-2 px-2 py-2 hover:bg-bg-secondary dark:hover:bg-dark-bg-secondary rounded transition"
                    onClick={() => setDisplayMobileMenu(false)}
                  >
                    <HiCog className="text-lg" />
                    Configuraciones de Seguridad
                  </Link>
                  <button
                    className="flex items-center gap-2 px-2 py-2 text-left hover:bg-bg-secondary dark:hover:bg-dark-bg-secondary rounded transition"
                    onClick={() => {
                      authClient.signOut();
                      setDisplayMobileMenu(false);
                      redirect("/");
                    }}
                  >
                    <HiLogout className="text-lg" />
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <hr className="border-t border-gray-700" />
                  <Link
                    href="/auth/sign-in"
                    className="flex items-center gap-2 px-2 py-2 hover:bg-bg-secondary dark:hover:bg-dark-bg-secondary rounded transition"
                    onClick={() => setDisplayMobileMenu(false)}
                  >
                    <HiLogin className="text-lg" />
                    Iniciar sesión
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    className="flex items-center gap-2 px-2 py-2 hover:bg-bg-secondary dark:hover:bg-dark-bg-secondary rounded transition"
                    onClick={() => setDisplayMobileMenu(false)}
                  >
                    <HiUserAdd className="text-lg" />
                    Registrarme
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export { Header };
