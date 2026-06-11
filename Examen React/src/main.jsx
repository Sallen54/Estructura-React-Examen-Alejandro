import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { Router } from './Router.jsx'
import { AuthProvider } from './auth/AuthContext';

// 2. Renderizamos la aplicación pasando el RouterProvider
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={Router} />
    </AuthProvider>
  </StrictMode>,
) 
