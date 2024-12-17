import React, { useState } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DynamicThreeBackground from "../components/DynamicBackground";

const STATIC_BACKGROUNDS = [
  "bg-gradient-to-r from-blue-400 to-blue-200",
  "bg-gradient-to-r from-red-400 to-yellow-200",
  "bg-gradient-to-r from-green-300 to-cyan-200",
];

const TOTAL_DYNAMIC_SCENARIOS = 3; // Número total de escenarios dinámicos

const ClientTemplate = ({
  name,
  phone,
  phoneCode,
  email,
  whatsapp,
  twitter,
  linkedin,
  instagram,
  content,
  specialization,
  imageUrl,
  pdfUrl,
}) => {
  const [currentBackground, setCurrentBackground] = useState(0);
  const [isDynamic, setIsDynamic] = useState(true);

  // Alternar entre todos los fondos (estáticos y dinámicos)
  const changeBackground = () => {
    if (isDynamic) {
      // Si estamos en fondo dinámico, cambiar al siguiente escenario dinámico
      if (currentBackground < TOTAL_DYNAMIC_SCENARIOS - 1) {
        setCurrentBackground(currentBackground + 1);
      } else {
        setIsDynamic(false);
        setCurrentBackground(0);
      }
    } else {
      // Si estamos en fondos estáticos, cambiar al siguiente o volver a dinámico
      if (currentBackground < STATIC_BACKGROUNDS.length - 1) {
        setCurrentBackground(currentBackground + 1);
      } else {
        setIsDynamic(true);
        setCurrentBackground(0);
      }
    }
  };

  return (
    <div className="relative min-h-screen font-sans bg-gray-100">
      {/* Fondo dinámico o estático */}
      <div className="fixed inset-0 z-0">
        {isDynamic ? (
          <DynamicThreeBackground currentScenario={currentBackground} />
        ) : (
          <div
            className={`absolute inset-0 ${STATIC_BACKGROUNDS[currentBackground]} transition-all duration-500`}
          />
        )}
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 bg-transparent">
        <Navbar />
        <main className="container mx-auto p-4 md:p-12">
          <div className="relative bg-white shadow-lg rounded-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <div className="md:flex items-stretch">
              {/* Imagen de perfil */}
              {imageUrl && (
                <div className="md:w-1/3 w-full flex items-center justify-center bg-blue-500">
                  <img
                    src={imageUrl}
                    alt={`Perfil de ${name}`}
                    className="w-56 h-56 rounded-full object-cover shadow-lg border-4 border-white"
                  />
                </div>
              )}

              {/* Información del usuario */}
              <div className="md:w-2/3 p-6 bg-white">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  👋 Hola, soy {name}
                </h1>
                {specialization && (
                  <h2 className="text-lg font-semibold text-gray-500 mb-4">
                    {specialization}
                  </h2>
                )}
                <p className="text-gray-600 text-base mb-4 leading-relaxed">
                  {content}
                </p>

                {/* Información de contacto */}
                <div className="space-y-3 mb-6 text-gray-600 m-2">
                  {phone && (
                    <p
                      className="flex items-center cursor-pointer hover:text-blue-600"
                      onClick={() => (window.location.href = `tel:${phone}`)}
                    >
                      <FaPhoneAlt className="mr-2 text-blue-500" />
                      {phoneCode} {phone}
                    </p>
                  )}
                  {email && (
                    <p
                      className="flex items-center cursor-pointer hover:text-blue-600"
                      onClick={() => (window.location.href = `mailto:${email}`)}
                    >
                      <FaEnvelope className="mr-2 text-blue-500" />
                      {email}
                    </p>
                  )}
                </div>

                {/* Redes sociales */}
                <div className="flex space-x-4 mb-4">
                  {whatsapp && (
                    <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                      <FaWhatsapp className="text-green-500 text-2xl hover:scale-110 transition-transform" />
                    </a>
                  )}
                  {twitter && (
                    <a href={twitter} target="_blank" rel="noopener noreferrer">
                      <FaTwitter className="text-blue-400 text-2xl hover:scale-110 transition-transform" />
                    </a>
                  )}
                  {linkedin && (
                    <a href={linkedin} target="_blank" rel="noopener noreferrer">
                      <FaLinkedin className="text-blue-700 text-2xl hover:scale-110 transition-transform" />
                    </a>
                  )}
                  {instagram && (
                    <a href={instagram} target="_blank" rel="noopener noreferrer">
                      <FaInstagram className="text-pink-500 text-2xl hover:scale-110 transition-transform" />
                    </a>
                  )}
                </div>

                {/* Botón para cambiar fondo */}
                <button
                  onClick={changeBackground}
                  className="mt-4 px-4 py-2 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all"
                >
                  🌌 Cambiar Fondo
                </button>
              </div>
            </div>
          </div>

          {/* PDF Viewer */}
          {pdfUrl && (
            <div className="mt-8 bg-white shadow-lg rounded-xl p-4">
              <h3 className="text-lg font-semibold text-blue-600 mb-3">
                📄 Mi Presentación
              </h3>
              <iframe
                src={pdfUrl}
                title="Presentación PDF"
                className="w-full h-[400px] rounded-lg shadow-inner"
              ></iframe>
              <a
                href={pdfUrl}
                download
                className="block mt-4 text-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all"
              >
                📥 Descargar PDF
              </a>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default ClientTemplate;
