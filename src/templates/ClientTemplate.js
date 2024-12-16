import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ClientTemplate = ({ name, content, imageUrl, contact, pdfUrl }) => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Section */}
      <main className="flex-1 container mx-auto p-6 md:p-12">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden md:flex md:items-center transition-transform hover:scale-[1.01]">
          {/* Image Section */}
          {imageUrl && (
            <div className="md:w-1/3 w-full flex justify-center md:justify-start p-6">
              <img
                src={imageUrl}
                alt={`Perfil de ${name}`}
                className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover border-4 border-blue-500"
              />
            </div>
          )}

          {/* Content Section */}
          <div className="md:w-2/3 p-6 md:p-8">
            <h1 className="text-4xl font-extrabold text-blue-600 mb-4">Hola, soy {name}!</h1>
            <p className="text-gray-700 leading-relaxed mb-6">{content}</p>

            {/* Contact Information */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Contáctame:</h3>
              <ul className="space-y-4">
                {contact.phone && (
                  <li className="flex items-center space-x-3">
                    <FaPhoneAlt className="text-green-500" />
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      {contact.phone}
                    </a>
                  </li>
                )}
                {contact.email && (
                  <li className="flex items-center space-x-3">
                    <FaEnvelope className="text-red-500" />
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      {contact.email}
                    </a>
                  </li>
                )}
              </ul>
              {/* Social Media */}
              <div className="flex space-x-6 mt-4">
                {contact.twitter && (
                  <a
                    href={contact.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-600 transition-transform hover:scale-110"
                  >
                    <FaTwitter size={24} />
                  </a>
                )}
                {contact.linkedin && (
                  <a
                    href={contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:text-blue-900 transition-transform hover:scale-110"
                  >
                    <FaLinkedin size={24} />
                  </a>
                )}
                {contact.instagram && (
                  <a
                    href={contact.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-500 hover:text-pink-700 transition-transform hover:scale-110"
                  >
                    <FaInstagram size={24} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* PDF Viewer Section */}
        {pdfUrl && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Mi presentación de servicios</h2>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <iframe
                src={pdfUrl}
                title="Presentación PDF"
                className="w-full h-[500px] border-none"
              ></iframe>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ClientTemplate;
