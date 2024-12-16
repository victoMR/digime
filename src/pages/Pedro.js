import React from 'react';
import ClientTemplate from '../templates/ClientTemplate';

const Pedro = () => {
  const contactInfo = {
    phone: '+34 987 654 321',
    email: 'pedro@example.com',
    twitter: 'https://twitter.com/pedro',
    linkedin: 'https://linkedin.com/in/pedro',
    instagram: 'https://instagram.com/pedro',
  };

  const content =
    'Soy Pedro, un emprendedor apasionado por la tecnología blockchain. Ayudo a empresas a integrar soluciones descentralizadas.';

  return (
    <ClientTemplate
      name="Pedro"
      content={content}
      imageUrl="https://this-person-does-not-exist.com/img/avatar-genbec06538aa654131b55604c44ddbb074.jpg"
      contact={contactInfo}
    />
  );
};

export default Pedro;
