# 🛒 Tienda NODO - Plataforma de E-commerce

**Tienda NODO** es una aplicación de comercio electrónico moderna y escalable construida con **Next.js 16+**, **React 19** y **TypeScript**. La plataforma incluye un sistema completo de gestión de productos, carrito de compras con persistencia en base de datos, autenticación robusta y un panel de administración.

## Credenciales de prueba

## Administrador

Email: admin@admin.com  
Password: 123123_Ms

## Usuario

Email: user@user.com  
Password: 123123_Ms

## 🚀 Características Principal

### Para Usuarios

- **Catálogo de Productos**: Exploración de productos por categorías con diseño responsivo.
- **Carrito de Compras**: Gestión de artículos, actualización de cantidades en tiempo real y cálculo de costos de envío.
- **Checkout Seguro**: Proceso de compra con transacciones atómicas que validan el stock y generan órdenes de pedido.
- **Autenticación**: Registro e inicio de sesión seguro gestionado por _Better-Auth_.
- **Diseño Moderno**: Interfaz con soporte para modo oscuro (Dark Mode) y animaciones fluidas utilizando Tailwind CSS 4.

### Para Administradores

- **Panel de Administración**: Protegido por roles (Role-based Access Control).
- **Gestión de Inventario (CRUD)**: Interfaz completa para agregar, editar y eliminar productos.
- **Validación de Datos**: Validación estricta en cliente y servidor con Zod.

## 🛠️ Stack Tecnológico

- **Framework**: [Next.js 15/16](https://nextjs.org/) (App Router)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Base de Datos**: [PostgreSQL](https://www.postgresql.org/) con [Prisma ORM](https://www.prisma.io/)
- **Autenticación**: [Better-Auth](https://www.better-auth.com/)
- **Estilos**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Estado Global**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Formularios**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Iconos**: [React Icons](https://react-icons.github.io/react-icons/)

## 📦 Instalación y Configuración

Sigue estos pasos para ejecutar el proyecto localmente:

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/nodo-next.git
cd nodo-next
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto y añade lo siguiente:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/nodo_db?schema=public"
BETTER_AUTH_SECRET="tu_secreto_aqui"
BETTER_AUTH_URL="http://localhost:3000"
```

### 4. Configurar la base de datos

Genera el cliente de Prisma y ejecuta las migraciones:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Sembrar la base de datos (Seed)

Para cargar los productos iniciales de prueba:

```bash
npx prisma db seed
```

### 6. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

## 📂 Estructura del Proyecto

```text
├── prisma/               # Esquema de DB y scripts de seed
├── src/
│   ├── app/              # Rutas (App Router) y API endpoints
│   │   ├── admin/        # Panel de administración protegido
│   │   ├── api/          # Rutas de servidor (Auth, Cart, Products)
│   │   ├── auth/         # Páginas de Sign-in/Sign-up
│   │   └── cart/         # Lógica del carrito de compras
│   ├── components/       # Componentes de UI reutilizables
│   ├── lib/              # Configuraciones (Auth, Prisma, Validaciones)
│   ├── services/         # Lógica de negocio (Cart services)
│   └── store/            # Estado global con Zustand
└── next.config.ts        # Configuración de Next.js (Remote Patterns)
```

## 🔐 Seguridad y Roles

El sistema utiliza middleware y componentes de alto orden (HOC) para proteger las rutas:

- **`RoleGate`**: Restringe el acceso a páginas de administración solo a usuarios con el enum `admin` en la base de datos.
- **`ProtectedRoute`**: Asegura que el usuario esté autenticado para ver su carrito o perfil.

---

Desarrollado para el **Nodo Tecnológico 2025/2026**.
