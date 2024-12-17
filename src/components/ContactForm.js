import React, { useState, useRef } from "react";
import axios from "axios";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaFilePdf,
  FaUpload,
  FaTrash,
  FaWhatsapp,
} from "react-icons/fa";
import Modal from "./modal";

const countryCodes = [
  { code: "+52", flag: "🇲🇽", country: "México" },
  { code: "+34", flag: "🇪🇸", country: "España" },
  { code: "+1", flag: "🇺🇸", country: "Estados Unidos" },
  { code: "+57", flag: "🇨🇴", country: "Colombia" },
  { code: "+54", flag: "🇦🇷", country: "Argentina" },
];

const ContactForm = () => {
  const [templateData, setTemplateData] = useState({
    phone: "",
    phoneCode: "+52",
    email: "",
    whatsapp: "",
    twitter: "",
    linkedin: "",
    instagram: "",
    username: "",
    description: "",
    specialization: "",
    pdfUrl: "",
    imageUrl: "",
    imageFile: null,
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showModal, setShowModal] = useState(false); // Estado para mostrar modal
  const [createdPage, setCreatedPage] = useState(""); // Guarda nombre de página creada
  const fileInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    if (files) {
      const file = files[0];
      if (name === "imageUpload") {
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setTemplateData((prevData) => ({
              ...prevData,
              imageUrl: reader.result,
              imageFile: file,
            }));
            setImagePreview(reader.result);
          };
          reader.readAsDataURL(file);
        }
      }
      return;
    }

    setTemplateData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRemoveImage = () => {
    setTemplateData({ ...templateData, imageUrl: "", imageFile: null });
    setImagePreview(null);
    fileInputRef.current.value = "";
  };

  const validateForm = () => {
    const newErrors = {};
    if (!templateData.username) newErrors.username = "Nombre es requerido";
    if (!templateData.terms) newErrors.terms = "Debe aceptar los términos";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("");

    if (!validateForm()) return;

    const formData = new FormData();
    // Append all text fields
    Object.keys(templateData).forEach((key) => {
      if (key !== "imageFile" && templateData[key]) {
        formData.append(key, templateData[key]);
      }
    });

    // Append files
    if (templateData.imageFile) {
      formData.append("imageFile", templateData.imageFile);
    }
    try {
      const response = await axios.post(
        "https://backdigime.onrender.com/api/users/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setCreatedPage(response.data.pageName); // Ejemplo de respuesta
      setShowModal(true); // Mostramos el modal

      console.log("Usuario creado:", response.data);
      // Hacer modal de que pagina fue creada exitosamente y redirigir a esa pagina

      setSubmitStatus("Usuario creado exitosamente");
      // Reset form after successful submission
      setTemplateData({
        phone: "",
        phoneCode: "+52",
        email: "",
        whatsapp: "",
        twitter: "",
        linkedin: "",
        instagram: "",
        username: "",
        description: "",
        specialization: "",
        pdfUrl: "",
        imageUrl: "",
        imageFile: null,
        terms: false,
      });
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (pdfInputRef.current) pdfInputRef.current.value = "";
    } catch (error) {
      console.error("Error al crear usuario:", error);
      setSubmitStatus("Error al crear usuario");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-7xl p-6 grid lg:grid-cols-2 gap-8">
        {/* Card Preview */}
        <div className="relative bg-gradient-to-br from-blue-600 to-blue-400 text-white rounded-3xl p-6 shadow-lg blur-sm">
          <div className="flex flex-col items-center text-center">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Perfil"
                className="w-40 h-40 rounded-full object-cover shadow-lg border-4 border-white"
              />
            ) : (
              <div className="w-40 h-40 rounded-full bg-white flex items-center justify-center text-blue-600 text-2xl font-semibold">
                Foto
              </div>
            )}
            <h2 className="mt-4 text-3xl font-bold">{templateData.username}</h2>
            <p className="text-lg mt-2">{templateData.description}</p>
            <p className="text-sm italic mt-1">
              {templateData.specialization || "Tu especialización o producto"}
            </p>
          </div>

          <div className="mt-6 space-y-4 text-sm">
            {templateData.phone && (
              <div className="flex items-center">
                <FaPhoneAlt className="mr-2" />
                <span>
                  {templateData.phoneCode} {templateData.phone}
                </span>
              </div>
            )}
            {templateData.whatsapp && (
              <div className="flex items-center">
                <FaWhatsapp className="mr-2" />
                <span>{templateData.whatsapp}</span>
              </div>
            )}
            {templateData.email && (
              <div className="flex items-center">
                <FaEnvelope className="mr-2" />
                <span>{templateData.email}</span>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-center gap-4 p-8">
            {templateData.twitter && (
              <a
                href={templateData.twitter}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter size={50} />
              </a>
            )}
            {templateData.linkedin && (
              <a
                href={templateData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin size={50} />
              </a>
            )}
            {templateData.instagram && (
              <a
                href={templateData.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram size={50} />
              </a>
            )}
            {templateData.pdfUrl && (
              <a
                href={templateData.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFilePdf size={50} />
              </a>
            )}
          </div>
        </div>

        {/* Formulario */}
        <div>
          <h2 className="text-2xl font-bold text-blue-600 text-center mb-6 animate-pulse	">
            Crea tu Tarjeta con nosotros 😊
          </h2>
          {submitStatus && (
            <div
              className={`mb-4 p-2 text-center rounded ${
                submitStatus.includes("exitosamente")
                  ? "bg-green-200 text-green-800"
                  : "bg-red-200 text-red-800"
              }`}
            >
              {submitStatus}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label>Nombre Completo</label>
              <input
                name="username"
                value={templateData.username}
                onChange={handleChange}
                placeholder="Tu nombre"
                className={`w-full p-2 border rounded-lg ${
                  errors.username ? "border-red-500" : ""
                }`}
              />
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username}</p>
              )}
            </div>
            <div>
              <label>Especialización o Producto</label>
              <input
                name="specialization"
                value={templateData.specialization}
                onChange={handleChange}
                placeholder="Ej: Desarrollo Web, Venta de productos"
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label>Descripción</label>
              <textarea
                name="description"
                value={templateData.description}
                onChange={handleChange}
                placeholder="Escribe una breve descripción sobre ti"
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div>
              <label>Foto de Perfil</label>
              <input
                type="file"
                ref={fileInputRef}
                name="imageUpload"
                accept="image/*"
                onChange={handleChange}
                className="block w-full"
                style={{ display: "none" }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="w-full p-2 border rounded-lg flex items-center justify-center gap-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                <FaUpload />
                Subir Foto
              </button>

              {imagePreview && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="w-full p-2 border rounded-lg flex items-center justify-center gap-2 bg-red-500 text-white hover:bg-red-600 transition-colors mt-2"
                >
                  <FaTrash />
                  Eliminar Foto
                </button>
              )}
            </div>
            <div>
              <label>Teléfono</label>
              <div className="flex items-center space-x-2">
                <select
                  name="phoneCode"
                  value={templateData.phoneCode}
                  onChange={handleChange}
                  className="border rounded-lg p-2"
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.code}
                    </option>
                  ))}
                </select>
                <input
                  name="phone"
                  value={templateData.phone}
                  onChange={handleChange}
                  placeholder="Tu número"
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>
            <div>
              <label>WhatsApp</label>
              <input
                name="whatsapp"
                value={templateData.whatsapp}
                onChange={handleChange}
                placeholder="Tu WhatsApp"
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label>Correo Electrónico</label>
              <input
                name="email"
                value={templateData.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label>Twitter</label>
              <input
                name="twitter"
                value={templateData.twitter}
                onChange={handleChange}
                placeholder="https://twitter.com/tu-usuario"
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label>LinkedIn</label>
              <input
                name="linkedin"
                value={templateData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/tu-usuario"
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label>Instagram</label>
              <input
                name="instagram"
                value={templateData.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/tu-usuario"
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label>PDF de Servicios</label>
              <input
                name="pdfUrl"
                value={templateData.pdfUrl}
                onChange={handleChange}
                placeholder="URL del PDF"
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="terms"
                checked={templateData.terms}
                onChange={handleChange}
                className="border rounded-lg p-2"
              />
              <label>Aceptar términos y condiciones</label>
              <div className="text-red-500">* Requerido</div>
              {errors.terms && (
                <p className="text-red-500 text-sm">{errors.terms}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full p-2 border rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              Crear Tarjeta
            </button>
          </form>
          {/* Modal */}
          {templateData.username && (
            <Modal
              show={showModal}
              title="¡Tarjeta Creada!"
              message={`La página ${templateData.username} ha sido creada exitosamente.`}
              onClose={() => window.location = "/"}
              onRedirect={() => (window.location = "/" + templateData.username)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
