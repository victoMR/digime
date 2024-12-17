import React from 'react';
import ClientTemplate from '../templates/ClientTemplate';
import anaPDF from '../assets/1.pdf';

const Ana = () => {
  const contactInfo = {
    phone: '+34 123 456 789',
    email: 'ana@example.com',
    twitter: 'https://twitter.com/ana',
    linkedin: 'https://linkedin.com/in/ana',
    instagram: 'https://instagram.com/ana',
  };

  const content =
    'Soy Ana, una profesional en el área de tecnología y diseño. Me encanta conectar con personas y trabajar en proyectos innovadores.';
  const pdfUrl = 'https://example.com/ana-servicios.pdf'; // URL del PDF

  return (
    <ClientTemplate
      name="Ana"
      content={content}
      imageUrl="https://this-person-does-not-exist.com/img/avatar-gen760da0c0df5dc813e03cd30bd51749e8.jpg"
      contact={contactInfo}
      pdfUrl={anaPDF}
    />
  );
};

export default Ana;
