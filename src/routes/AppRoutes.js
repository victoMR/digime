import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import ContactForm from "../components/ContactForm";

// Spinner global de carga
const GlobalSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
    <ClipLoader
      color="#36D7B7"
      loading={true}
      size={50}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  </div>
);

// Función para importar dinámicamente todos los componentes
const loadUserPages = () => {
  const components = {};
  const context = require.context("../pages/", false, /\.js$/);

  context.keys().forEach((fileName) => {
    // Extraer el nombre base (sin extensión ni "Component")
    const componentName = fileName.replace("./", "").replace("Component.js", "");
    //console.log("Cargando página dinámica:", componentName);

    // Cargar el componente dinámicamente
    components[componentName] = React.lazy(() =>
      import(`../pages/${fileName.replace("./", "")}`)
    );
  });

  return components;
};

const userPages = loadUserPages();

const AppRoutes = () => {
  return (
    <Router>
      <Suspense fallback={<GlobalSpinner />}>
        <Routes>
          {/* Ruta principal */}
          <Route path="/" element={<Home />} />

          {/* Ruta del formulario */}
          <Route path="/registro" element={<ContactForm />} />

          {/* Rutas dinámicas para usuarios */}
          {Object.entries(userPages).map(([username, Component]) => (
            <Route
              key={username}
              path={`/${username}`}
              element={
                <Suspense fallback={<GlobalSpinner />}>
                  <Component />
                </Suspense>
              }
            />
          ))}

          {/* Ruta comodín */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;
