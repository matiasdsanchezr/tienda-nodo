"use client";
import Link from "next/link";

const ContactPage = () => {
  return (
    <main className="flex-1 bg-bg-primary dark:bg-dark-bg-primary min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Contacto</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Visitanos, llamanos o seguinos en nuestras redes sociales
          </p>
        </div>

        {/* Grid de información */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Dirección del Local */}
          <div className="bg-bg-secondary dark:bg-dark-bg-secondary rounded-lg shadow-lg p-8 hover:shadow-2xl transition-all duration-200">
            <div className="text-6xl mb-4 text-center">📍</div>
            <h2 className="font-bold text-xl mb-3 text-center">Dirección</h2>
            <div className="text-center">
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                Corrientes 459
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                San Fernando del Valle de Catamarca, Catamarca
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Argentina (CP: 4700)
              </p>
              <Link
                href="https://maps.app.goo.gl/G6mdtnHbntgCHaMLA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-200 text-sm font-semibold"
              >
                Ver en Google Maps
              </Link>
            </div>
          </div>

          {/* Teléfonos */}
          <div className="bg-bg-secondary dark:bg-dark-bg-secondary rounded-lg shadow-lg p-8 hover:shadow-2xl transition-all duration-200">
            <div className="text-6xl mb-4 text-center">📱</div>
            <h2 className="font-bold text-xl mb-3 text-center">Teléfonos</h2>
            <div className="space-y-3">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Local
                </p>
                <Link
                  href="tel:+543838123456"
                  className="text-blue-600 hover:underline font-semibold text-lg"
                >
                  (383) 443-3333
                </Link>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Celular / WhatsApp
                </p>
                <Link
                  href="https://wa.me/5493838123456"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-semibold text-lg"
                >
                  +54 9 (383) 439-9959
                </Link>
              </div>
              <div className="text-center mt-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Lunes a Viernes: 9:00 - 20:00
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Sábados: 9:00 - 14:00
                </p>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="bg-bg-secondary dark:bg-dark-bg-secondary rounded-lg shadow-lg p-8 hover:shadow-2xl transition-all duration-200">
            <div className="text-6xl mb-4 text-center">📧</div>
            <h2 className="font-bold text-xl mb-3 text-center">Email</h2>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Envianos tu consulta
              </p>
              <Link
                href="mailto:contacto@tiendanodo.com"
                className="text-blue-600 hover:underline font-semibold text-lg break-all"
              >
                contacto@tiendanodo.com
              </Link>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                Respondemos en menos de 24 horas
              </p>
            </div>
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="bg-bg-secondary dark:bg-dark-bg-secondary rounded-lg shadow-lg p-8 mb-12">
          <h2 className="font-bold text-2xl mb-6 text-center">
            Seguinos en Redes Sociales
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Facebook */}
            <Link
              href="https://facebook.com/tutienda"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-6 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-all duration-200 group"
            >
              <div className="text-6xl mb-3 group-hover:scale-110 transition-transform duration-200">
                📘
              </div>
              <p className="font-semibold">Facebook</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                @tiendanodo
              </p>
            </Link>

            {/* Instagram */}
            <Link
              href="https://instagram.com/tutienda"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-6 rounded-lg hover:bg-pink-50 dark:hover:bg-gray-800 transition-all duration-200 group"
            >
              <div className="text-6xl mb-3 group-hover:scale-110 transition-transform duration-200">
                📷
              </div>
              <p className="font-semibold">Instagram</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                @tiendanodo
              </p>
            </Link>

            {/* WhatsApp */}
            <Link
              href="https://wa.me/5493834399959"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-6 rounded-lg hover:bg-green-50 dark:hover:bg-gray-800 transition-all duration-200 group"
            >
              <div className="text-6xl mb-3 group-hover:scale-110 transition-transform duration-200">
                💬
              </div>
              <p className="font-semibold">WhatsApp</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Chateá con nosotros
              </p>
            </Link>

            {/* Twitter/X */}
            <Link
              href="https://twitter.com/tutienda"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-6 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-all duration-200 group"
            >
              <div className="text-6xl mb-3 group-hover:scale-110 transition-transform duration-200">
                🐦
              </div>
              <p className="font-semibold">Twitter</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                @tiendanodo
              </p>
            </Link>
          </div>
        </div>

        {/* Horarios de Atención */}
        <div className="bg-bg-secondary dark:bg-dark-bg-secondary rounded-lg shadow-lg p-8">
          <h2 className="font-bold text-2xl mb-6 text-center">
            Horarios de Atención
          </h2>
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between p-4 bg-bg-primary dark:bg-dark-bg-primary rounded">
                <span className="font-semibold">Lunes a Viernes</span>
                <span className="text-gray-600 dark:text-gray-400">
                  9:00 - 20:00
                </span>
              </div>
              <div className="flex justify-between p-4 bg-bg-primary dark:bg-dark-bg-primary rounded">
                <span className="font-semibold">Sábados</span>
                <span className="text-gray-600 dark:text-gray-400">
                  9:00 - 14:00
                </span>
              </div>
              <div className="flex justify-between p-4 bg-bg-primary dark:bg-dark-bg-primary rounded">
                <span className="font-semibold">Domingos</span>
                <span className="text-gray-600 dark:text-gray-400">
                  Cerrado
                </span>
              </div>
              <div className="flex justify-between p-4 bg-bg-primary dark:bg-dark-bg-primary rounded">
                <span className="font-semibold">Feriados</span>
                <span className="text-gray-600 dark:text-gray-400">
                  Cerrado
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mapa */}
        <div className="mt-12 bg-bg-secondary dark:bg-dark-bg-secondary rounded-lg shadow-lg p-8">
          <h2 className="font-bold text-2xl mb-6 text-center">¿Cómo llegar?</h2>
          <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
            <iframe
              src="https://maps.google.com/maps?q=28%C2%B028%2707.9%22S+65%C2%B046%2744.5%22W&t=&z=13&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación del local"
            ></iframe>
          </div>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
            Estamos ubicados en el centro de La Puerta, a pocas cuadras de la
            plaza principal
          </p>
        </div>
      </div>
    </main>
  );
};

export default ContactPage;
