import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import NotFound from '../pages/NotFound';

// Importar todas las páginas de usuario dinámicamente
const importUserPages = () => {
  const userPages = {};
  const context = require.context('../pages', false, /^\.\/[A-Z][a-zA-Z]+\.js$/);
  
  context.keys().forEach(key => {
    const username = key.replace('./', '').replace('.js', '');
    if (username !== 'NotFound') {
      // Usar importación dinámica con React.lazy
      userPages[username] = React.lazy(() => import(`../pages/${username}`));
    }
  });
  
  return userPages;
};

// Componente de carga global con spinner
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

const AppRoutes = () => {
  // Importar páginas de usuario dinámicamente
  const userPages = importUserPages();
  
  // Obtener el primer usuario como ruta predeterminada si no se establece un usuario específico
  const defaultUser = Object.keys(userPages)[0];

  return (
    <Router>
      <Suspense fallback={<GlobalSpinner />}>
        <Routes>
          {/* Ruta predeterminada al primer usuario */}
          <Route path="/" element={<Navigate to={`/${defaultUser}`} />} />
          
          {/* Generar rutas dinámicamente para cada usuario */}
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
          
          {/* Ruta comodín para rutas indefinidas */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;